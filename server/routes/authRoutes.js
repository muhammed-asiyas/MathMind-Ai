const express = require("express");

const {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword,
  requestAuthenticatedPasswordReset,
  verifyAuthenticatedPasswordResetOtp,
  resetAuthenticatedPassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);

router.post("/account/forgot-password", protect, requestAuthenticatedPasswordReset);
router.post("/account/verify-reset-otp", protect, verifyAuthenticatedPasswordResetOtp);
router.post("/account/reset-password", protect, resetAuthenticatedPassword);

module.exports = router;