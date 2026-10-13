const express = require("express");
const { askAI, recognizeHandwriting } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ask", protect, askAI);
router.post("/recognize-handwriting", protect, recognizeHandwriting);

module.exports = router;