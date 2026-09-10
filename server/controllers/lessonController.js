const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");
const { seedInitialData } = require("./topicController");
const { resolveQuestionSetKey } = require("../services/lessonQuestionBank");

const getLessons = async (req, res) => {
  try {
    await seedInitialData();

    const { topicId } = req.query;

    const filter = topicId
      ? { topic: topicId }
      : {};

    const lessons = await Lesson.find(filter)
      .populate("topic", "title icon")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.lessonId)) {
      return res.status(400).json({ success: false, message: "Invalid lesson ID" });
    }

    const lesson = await Lesson.findById(req.params.lessonId).populate("topic", "title icon");

    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    return res.status(200).json({ success: true, lesson });
  } catch (error) {
    console.error("GET LESSON ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch lesson" });
  }
};

const createLesson = async (req, res) => {
  try {
    const {
      topic,
      title,
      questionSetKey,
      description,
      content,
      videoUrl,
      difficulty,
      order,
      duration,
    } = req.body;

    const lesson = await Lesson.create({
      topic,
      title,
      questionSetKey: questionSetKey || resolveQuestionSetKey(title),
      description,
      content,
      videoUrl,
      difficulty,
      order,
      duration,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lesson",
    });
  }
};

module.exports = {
  getLessons,
  getLessonById,
  createLesson,
};