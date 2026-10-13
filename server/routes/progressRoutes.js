const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
	getTopicProgress,
	saveQuestionProgress,
	getDailyProgress,
	getLearningProfileForStudent,
	getRoadmapProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/daily", protect, getDailyProgress);
router.get("/learning-profile", protect, getLearningProfileForStudent);
router.get("/roadmap", protect, getRoadmapProgress);
router.get("/:topicId", protect, getTopicProgress);
router.post("/:topicId/questions", protect, saveQuestionProgress);

module.exports = router;
