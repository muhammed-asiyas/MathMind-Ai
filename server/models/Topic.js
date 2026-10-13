const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "📚",
    },

    difficulty: {
      type: String,
      enum: ["Foundation", "Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    order: {
      type: Number,
      default: 0,
    },

    stageNumber: {
      type: Number,
      default: 1,
    },

    requiredCorrectToUnlock: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Topic", topicSchema);