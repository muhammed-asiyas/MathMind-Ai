const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastLoginDate: {
      type: String,
      default: "",
    },
    preferredTopic: {
      type: String,
      default: "Algebra",
      trim: true,
    },

    dailyGoal: {
      type: Number,
      enum: [5, 10, 15, 20],
      default: 10,
    },

    passwordResetOtpHash: {
      type: String,
      default: "",
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },

    passwordResetAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);