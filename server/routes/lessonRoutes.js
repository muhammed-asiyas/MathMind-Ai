const express = require("express");

const {
  getLessons,
  getLessonById,
  createLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, getLessons);
router.get("/:lessonId", protect, getLessonById);
router.post("/", protect, requireAdmin, createLesson);
router.delete("/:id", protect, requireAdmin, deleteLesson);

module.exports = router;