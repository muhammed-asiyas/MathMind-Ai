const { askAgent } = require("../services/aiAgentService");
const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");
const { generatePracticeQuestions, recognizeHandwriting } = require("../services/aiService");

const askAI = async (req, res) => {
  try {
    const question = String(req.body.question || "").trim();
    if (!question) return res.status(400).json({ success: false, message: "Please enter a maths question." });
    if (question.length > 2000) return res.status(400).json({ success: false, message: "Please keep your question under 2,000 characters." });

    const result = await askAgent(question);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("ASK AI ERROR:", error);
    return res.status(500).json({ success: false, message: "The AI tutor is temporarily unavailable." });
  }
};

const generatePractice = async (req, res) => {
  try {
    const { lessonId, difficulty } = req.body;
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ success: false, message: "Choose a valid lesson before generating practice." });
    }
    if (!["Beginner", "Intermediate", "Hard"].includes(difficulty)) {
      return res.status(400).json({ success: false, message: "Choose a valid practice difficulty." });
    }

    const lesson = await Lesson.findById(lessonId).populate("topic", "title");
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found. Choose a lesson and try again." });
    }

    const questions = await generatePracticeQuestions({
      lesson: {
        title: lesson.title,
        topicTitle: lesson.topic?.title || "Mathematics",
        description: lesson.description,
        content: lesson.content,
      },
      difficulty,
    });
    return res.status(200).json({
      success: true,
      lesson: lesson.title,
      difficulty,
      questions: questions.map((question, questionIndex) => ({ ...question, questionIndex, difficulty })),
    });
  } catch (error) {
    console.error("GENERATE AI PRACTICE ERROR:", error);
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.clientMessage || "AI practice could not be generated right now. Please try again.",
    });
  }
};

const recognizeHandwritingController = async (req, res) => {
  const { imageDataUrl } = req.body;
  const imageMatch = typeof imageDataUrl === "string"
    ? imageDataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/)
    : null;

  if (!imageMatch) {
    return res.status(400).json({ success: false, message: "A valid PNG handwriting image is required." });
  }

  if (Buffer.from(imageMatch[1], "base64").byteLength > 1024 * 1024) {
    return res.status(413).json({ success: false, message: "The handwriting image is too large. Please try again." });
  }

  try {
    const result = await recognizeHandwriting(imageDataUrl);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("HANDWRITING RECOGNITION ERROR:", error);
    const statusCode = error.statusCode || 502;
    const message = error.clientMessage || "Handwriting recognition is temporarily unavailable. Please type your answer instead.";
    return res.status(statusCode).json({ success: false, message });
  }
};

module.exports = { askAI, generatePractice, recognizeHandwriting: recognizeHandwritingController };