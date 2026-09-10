const User = require("../models/User");
const Progress = require("../models/Progress");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const getToday = () => new Date().toISOString().slice(0, 10);

const getPreviousDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

const createMailer = () => {
  const requiredValues = [process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASS];
  if (requiredValues.some((value) => !value || /your_|replace_with|example\.com/i.test(value))) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    // Check required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const today = getToday();
    if (user.lastLoginDate !== today) {
      user.streak = !user.lastLoginDate
        ? 1
        : user.lastLoginDate === getPreviousDate(today)
          ? user.streak + 1
          : 1;

      await Progress.updateMany(
        { user: user._id },
        { $set: { attemptedQuestions: [], correctQuestions: [] } }
      );

      user.lastLoginDate = today;
      await user.save();
    } else if (user.streak < 1) {
      user.streak = 1;
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        lastLoginDate: user.lastLoginDate,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const genericResponse = {
    success: true,
    message: "If an account exists for that email, a verification code has been sent.",
  };

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(200).json(genericResponse);

    const user = await User.findOne({ email });
    const mailer = createMailer();
    if (!mailer) {
      return res.status(503).json({
        success: false,
        message: "Password reset email service is not configured. Add SMTP settings to the server environment.",
      });
    }
    if (!user) return res.status(200).json(genericResponse);

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.passwordResetOtpHash = await bcrypt.hash(otp, 10);
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetAttempts = 0;
    await user.save();

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "Your MathMind AI password reset code",
      text: `Your MathMind AI verification code is ${otp}. It expires in 10 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2>Reset your MathMind AI password</h2><p>Use this verification code to continue:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#4f46e5">${otp}</p><p>This code expires in 10 minutes. If you did not request a reset, you can ignore this email.</p></div>`,
    });

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR:", error);
    return res.status(502).json({
      success: false,
      message: "The email provider rejected the reset email. Check the Gmail address and App Password in server/.env.",
    });
  }
};

const verifyPasswordResetOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const user = await User.findOne({ email });

    if (!user || !user.passwordResetOtpHash || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date() || user.passwordResetAttempts >= 5 || !(await bcrypt.compare(otp, user.passwordResetOtpHash))) {
      if (user) {
        user.passwordResetAttempts += 1;
        await user.save();
      }
      return res.status(400).json({ success: false, message: "This code is invalid or has expired." });
    }

    return res.status(200).json({ success: true, message: "Code verified. You can now choose a new password." });
  } catch (error) {
    console.error("PASSWORD RESET OTP ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not verify the code." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });

    if (!user || !user.passwordResetOtpHash || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date() || user.passwordResetAttempts >= 5 || !(await bcrypt.compare(otp, user.passwordResetOtpHash))) {
      return res.status(400).json({ success: false, message: "Your reset session is invalid or expired. Please request a new code." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetOtpHash = "";
    user.passwordResetExpiresAt = null;
    user.passwordResetAttempts = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("PASSWORD RESET ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not reset the password." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword,
};