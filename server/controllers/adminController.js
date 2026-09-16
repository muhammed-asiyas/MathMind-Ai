const User = require("../models/User");
const Topic = require("../models/Topic");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const bcrypt = require("bcryptjs");

const getAdminOverview = async (req, res) => {
  try {
    const [studentCount, topicCount, lessonCount, progressCount, recentStudents, topics] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Topic.countDocuments(),
      Lesson.countDocuments(),
      Progress.countDocuments(),
      User.find({ role: "student" })
        .select("firstName lastName email xp level streak createdAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Topic.find().select("title icon difficulty order").sort({ order: 1, title: 1 }).lean(),
    ]);

    const lessons = await Lesson.find()
      .select("title topic difficulty duration questionSetKey")
      .populate("topic", "title")
      .sort({ topic: 1, order: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      metrics: { studentCount, topicCount, lessonCount, progressCount },
      recentStudents,
      topics,
      lessons,
    });
  } catch (error) {
    console.error("ADMIN OVERVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to load admin overview" });
  }
};

// GET all students (for student management tab)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("firstName lastName email xp level streak createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("GET ALL STUDENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
};

// POST create a student account (admin manually adds a student)
const addStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Student account created successfully.",
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        xp: student.xp,
        level: student.level,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to create student account." });
  }
};

// DELETE remove a student account by id
const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    if (student.role !== "student") {
      return res.status(403).json({ success: false, message: "You can only remove student accounts from this panel." });
    }

    // Also remove their progress records
    await Progress.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Student removed successfully." });
  } catch (error) {
    console.error("REMOVE STUDENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to remove student." });
  }
};

module.exports = { getAdminOverview, getAllStudents, addStudent, removeStudent };
