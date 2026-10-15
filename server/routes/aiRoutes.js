const express = require("express");
const { askAI, generatePractice, recognizeHandwriting } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ask", protect, askAI);
router.post("/practice", protect, generatePractice);
router.post("/recognize-handwriting", protect, recognizeHandwriting);

module.exports = router;