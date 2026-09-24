const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { listConversations, getConversation, sendMessage } = require("../controllers/chatController");

const router = express.Router();

router.use(protect);
router.get("/conversations", requireAdmin, listConversations);
router.get("/conversations/me", getConversation);
router.get("/conversations/:conversationId", getConversation);
router.post("/conversations/:conversationId/messages", sendMessage);
router.post("/messages", sendMessage);

module.exports = router;
