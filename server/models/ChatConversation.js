const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

const chatConversationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    unreadForStudent: {
      type: Number,
      default: 0,
    },
    unreadForAdmin: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    lastMessagePreview: {
      type: String,
      default: "",
      maxlength: 160,
    },
  },
  { timestamps: true }
);

chatConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("ChatConversation", chatConversationSchema);
