const express = require("express");

const {
  getTopics,
  createTopic,
  deleteTopic,
} = require("../controllers/topicController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, getTopics);
router.post("/", protect, requireAdmin, createTopic);
router.delete("/:id", protect, requireAdmin, deleteTopic);

module.exports = router;