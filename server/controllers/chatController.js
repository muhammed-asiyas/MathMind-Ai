const mongoose = require("mongoose");
const ChatConversation = require("../models/ChatConversation");
const Notification = require("../models/Notification");
const User = require("../models/User");

const conversationFields = "firstName lastName email role";

const conversationResponse = (conversation) => {
  const data = conversation.toObject ? conversation.toObject() : conversation;
  return {
    ...data,
    student: data.student,
    messages: data.messages || [],
  };
};

const getStudentConversation = async (studentId) => ChatConversation.findOne({ student: studentId }).populate("student", conversationFields);

const listConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find({})
      .populate("student", conversationFields)
      .sort({ lastMessageAt: -1, updatedAt: -1 });
    return res.status(200).json({ success: true, conversations: conversations.map(conversationResponse) });
  } catch (error) {
    console.error("LIST CHAT CONVERSATIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to load conversations." });
  }
};

const getConversation = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const conversation = isAdmin
      ? (mongoose.Types.ObjectId.isValid(req.params.conversationId)
        ? await ChatConversation.findById(req.params.conversationId).populate("student", conversationFields)
        : null)
      : await getStudentConversation(req.user.userId);

    if (!conversation) {
      return res.status(200).json({ success: true, conversation: null });
    }

    if (isAdmin) {
      conversation.unreadForAdmin = 0;
    } else {
      conversation.unreadForStudent = 0;
    }
    await conversation.save();

    return res.status(200).json({ success: true, conversation: conversationResponse(conversation) });
  } catch (error) {
    console.error("GET CHAT CONVERSATION ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to load conversation." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const body = String(req.body.body || "").trim();
    if (!body || body.length > 2000) {
      return res.status(400).json({ success: false, message: "Message must be between 1 and 2000 characters." });
    }

    const isAdmin = req.user.role === "admin";
    let conversation = isAdmin
      ? (mongoose.Types.ObjectId.isValid(req.params.conversationId)
        ? await ChatConversation.findById(req.params.conversationId).populate("student", conversationFields)
        : null)
      : await getStudentConversation(req.user.userId);

    if (!conversation && !isAdmin) {
      conversation = await ChatConversation.create({ student: req.user.userId });
      conversation = await getStudentConversation(req.user.userId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    const studentId = conversation.student._id || conversation.student;
    const sender = await User.findById(req.user.userId).select(conversationFields);
    if (!sender) return res.status(404).json({ success: false, message: "Sender not found." });

    conversation.messages.push({ sender: req.user.userId, senderRole: req.user.role, body });
    conversation.lastMessageAt = new Date();
    conversation.lastMessagePreview = body.slice(0, 160);
    if (isAdmin) {
      conversation.unreadForStudent += 1;
    } else {
      conversation.unreadForAdmin += 1;
    }
    await conversation.save();

    const recipient = isAdmin
      ? studentId
      : (await User.findOne({ role: "admin" }).select("_id"))?._id;
    if (recipient) {
      await Notification.create({
        recipient,
        title: isAdmin ? "Your teacher replied" : "New student question",
        message: isAdmin ? body.slice(0, 240) : `${sender.firstName} ${sender.lastName} needs help with a question.`,
        link: "/chat",
      });
    }

    const savedConversation = await ChatConversation.findById(conversation._id).populate("student", conversationFields);
    return res.status(201).json({ success: true, conversation: conversationResponse(savedConversation) });
  } catch (error) {
    console.error("SEND CHAT MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

module.exports = { listConversations, getConversation, sendMessage };
