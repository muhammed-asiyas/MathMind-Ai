const mongoose = require("mongoose");
const Question = require("../models/Question");
const Lesson = require("../models/Lesson");
const { getLessonQuestions: getQuestionBankForLesson, resolveQuestionSetKey } = require("../services/lessonQuestionBank");

const syncTopicQuestions = async (req, res) => {
	try {
		const { topic, questions } = req.body;

		if (!mongoose.Types.ObjectId.isValid(topic) || !Array.isArray(questions) || questions.length === 0) {
			return res.status(400).json({ success: false, message: "Topic questions are invalid" });
		}

		const validQuestions = questions.slice(0, 15).map((question, index) => ({
			updateOne: {
				filter: { topic, questionIndex: index },
				update: {
					$set: {
						topic,
						questionIndex: index,
						prompt: String(question.prompt || "").trim(),
						answer: String(question.answer || "").trim(),
						hint: String(question.hint || "").trim(),
					},
				},
				upsert: true,
			},
		})).filter(({ updateOne }) => updateOne.update.$set.prompt && updateOne.update.$set.answer && updateOne.update.$set.hint);

		if (validQuestions.length === 0) {
			return res.status(400).json({ success: false, message: "No valid questions supplied" });
		}

		await Question.bulkWrite(validQuestions);
		const storedQuestions = await Question.find({ topic }).sort({ questionIndex: 1 });

		return res.status(200).json({ success: true, questions: storedQuestions });
	} catch (error) {
		console.error("SYNC QUESTIONS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to save topic questions" });
	}
};

const getTopicQuestions = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.topicId)) {
			return res.status(400).json({ success: false, message: "Invalid topic ID" });
		}

		const questions = await Question.find({ topic: req.params.topicId }).sort({ questionIndex: 1 });
		return res.status(200).json({ success: true, questions });
	} catch (error) {
		console.error("GET QUESTIONS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch topic questions" });
	}
};

const getDailyTopicQuestion = async (req, res) => {
	try {
		const { topicId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(topicId)) {
			return res.status(400).json({ success: false, message: "Invalid topic ID" });
		}

		const questions = await Question.find({ topic: topicId }).sort({ questionIndex: 1 });
		if (questions.length === 0) {
			return res.status(404).json({ success: false, message: "No questions found for this topic" });
		}

		const today = new Date().toISOString().slice(0, 10);
		const dayNumber = Math.floor(Date.parse(`${today}T00:00:00.000Z`) / 86400000);
		const question = questions[dayNumber % questions.length];

		return res.status(200).json({ success: true, date: today, question });
	} catch (error) {
		console.error("GET DAILY QUESTION ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch daily question" });
	}
};

const getLessonQuestions = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.lessonId)) {
			return res.status(400).json({ success: false, message: "Invalid lesson ID" });
		}

		const lesson = await Lesson.findById(req.params.lessonId).populate("topic", "title").select("questionSetKey title order topic");
		if (!lesson) {
			return res.status(404).json({ success: false, message: "Lesson not found" });
		}

		const questionSetKey = lesson.questionSetKey || resolveQuestionSetKey(lesson.title, lesson.topic?.title, lesson.order);
		const questions = getQuestionBankForLesson(questionSetKey);
		return res.status(200).json({
			success: true,
			lesson: { id: lesson._id, title: lesson.title, order: lesson.order },
			questions,
		});
	} catch (error) {
		console.error("GET LESSON QUESTIONS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch lesson questions" });
	}
};

module.exports = {
	syncTopicQuestions,
	getTopicQuestions,
	getDailyTopicQuestion,
	getLessonQuestions,
};
