const express = require("express");

const {
  getTopics,
  createTopic,
} = require("../controllers/topicController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTopics);

router.post("/", protect, createTopic);

module.exports = router;