const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { syncTopicQuestions, getTopicQuestions, getDailyTopicQuestion, getLessonQuestions } = require("../controllers/quizController");

const router = express.Router();

router.get("/topics/:topicId/questions", protect, getTopicQuestions);
router.get("/topics/:topicId/daily", protect, getDailyTopicQuestion);
router.get("/lessons/:lessonId/questions", protect, getLessonQuestions);
router.post("/questions/sync", protect, requireAdmin, syncTopicQuestions);

module.exports = router;
