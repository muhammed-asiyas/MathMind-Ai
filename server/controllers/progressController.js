const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const DailyProgress = require("../models/DailyProgress");
const User = require("../models/User");

const getToday = () => new Date().toISOString().slice(0, 10);

const dailyResponse = (dailyProgress, dailyGoal = 10) => ({
	attempts: dailyProgress?.attempts || 0,
	correct: dailyProgress?.correct || 0,
	wrong: dailyProgress?.wrong || 0,
	limit: dailyGoal,
});

const getDailyProgress = async (req, res) => {
	try {
		const [dailyProgress, user] = await Promise.all([
			DailyProgress.findOne({ user: req.user.userId, date: getToday() }),
			User.findById(req.user.userId).select("dailyGoal"),
		]);
		return res.status(200).json({ success: true, daily: dailyResponse(dailyProgress, user?.dailyGoal) });
	} catch (error) {
		console.error("GET DAILY PROGRESS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch daily progress" });
	}
};

const getTopicProgress = async (req, res) => {
	try {
		const { topicId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(topicId)) {
			return res.status(400).json({ success: false, message: "Invalid topic ID" });
		}

		const progress = await Progress.findOne({ user: req.user.userId, topic: topicId });

		return res.status(200).json({
			success: true,
			progress: progress || { attemptedQuestions: [], correctQuestions: [] },
		});
	} catch (error) {
		console.error("GET PROGRESS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch progress" });
	}
};

const saveQuestionProgress = async (req, res) => {
	try {
		const { topicId } = req.params;
		const { questionIndex, isCorrect } = req.body;

		if (!mongoose.Types.ObjectId.isValid(topicId)) {
			return res.status(400).json({ success: false, message: "Invalid topic ID" });
		}

		if (!Number.isInteger(questionIndex) || questionIndex < 0 || typeof isCorrect !== "boolean") {
			return res.status(400).json({ success: false, message: "Question progress is invalid" });
		}

		const existingProgress = await Progress.findOne({ user: req.user.userId, topic: topicId });
		if (existingProgress?.attemptedQuestions.includes(questionIndex)) {
			const dailyProgress = await DailyProgress.findOne({ user: req.user.userId, date: getToday() });
			const user = await User.findById(req.user.userId).select("firstName lastName email role xp level streak dailyGoal");

			return res.status(200).json({
				success: true,
				alreadyAttempted: true,
				progress: existingProgress,
				daily: dailyResponse(dailyProgress, user?.dailyGoal),
				scoreChange: 0,
				user,
			});
		}

		const today = getToday();
		let dailyProgress = await DailyProgress.findOne({ user: req.user.userId, date: today });

		if (!dailyProgress) {
			dailyProgress = await DailyProgress.create({ user: req.user.userId, date: today });
		}

		dailyProgress.attempts += 1;
		dailyProgress[isCorrect ? "correct" : "wrong"] += 1;
		await dailyProgress.save();

		const update = {
			$addToSet: { attemptedQuestions: questionIndex },
		};

		if (isCorrect) {
			update.$addToSet.correctQuestions = questionIndex;
		}

		const progress = await Progress.findOneAndUpdate(
			{ user: req.user.userId, topic: topicId },
			update,
			{ new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
		);

		const scoreChange = isCorrect ? 10 : -5;
		const user = await User.findByIdAndUpdate(
			req.user.userId,
			{ $inc: { xp: scoreChange } },
			{ new: true }
		).select("firstName lastName email role xp level streak dailyGoal");

		return res.status(200).json({
			success: true,
			progress,
			daily: dailyResponse(dailyProgress, user?.dailyGoal),
			scoreChange,
			user,
		});
	} catch (error) {
		console.error("SAVE PROGRESS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to save progress" });
	}
};

module.exports = {
	getDailyProgress,
	getTopicProgress,
	saveQuestionProgress,
};
