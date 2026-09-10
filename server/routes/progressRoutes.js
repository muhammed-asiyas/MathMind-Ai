const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
	getTopicProgress,
	saveQuestionProgress,
	getDailyProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/daily", protect, getDailyProgress);
router.get("/:topicId", protect, getTopicProgress);
router.post("/:topicId/questions", protect, saveQuestionProgress);

module.exports = router;
