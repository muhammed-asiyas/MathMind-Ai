const express = require("express");

const {
  getLessons,
  getLessonById,
  createLesson,
} = require("../controllers/lessonController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLessons);

router.get("/:lessonId", protect, getLessonById);

router.post("/", protect, createLesson);

module.exports = router;