const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const DailyProgress = require("../models/DailyProgress");
const User = require("../models/User");
const Topic = require("../models/Topic");
const { getLearningProfile } = require("../services/learningLevelService");
const { seedInitialData } = require("./topicController");

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

const getLearningProfileForStudent = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select("xp level preferredTopic");
		if (!user) return res.status(404).json({ success: false, message: "Student not found" });
		return res.status(200).json({ success: true, profile: getLearningProfile(user.xp, user.preferredTopic) });
	} catch (error) {
		console.error("GET LEARNING PROFILE ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch learning profile" });
	}
};

const getRoadmapProgress = async (req, res) => {
	try {
		const userRole = req.user?.role;
		const isAdmin = userRole === "admin";

		// Ensure topics and lessons are seeded/migrated to 1..5 curriculum
		await seedInitialData();

		const topics = await Topic.find().sort({ order: 1 });
		const progressList = await Progress.find({ user: req.user.userId });
		const progressMap = {};
		progressList.forEach((p) => {
			progressMap[String(p.topic)] = p;
		});

		let previousStageCompleted = true; // Stage 1 (Foundation / Basic Maths) is unlocked for everyone
		const roadmap = [];

		for (let i = 0; i < topics.length; i++) {
			const topic = topics[i];
			const prog = progressMap[String(topic._id)] || { attemptedQuestions: [], correctQuestions: [] };
			const correctCount = Array.isArray(prog.correctQuestions) ? prog.correctQuestions.length : 0;
			const attemptedCount = Array.isArray(prog.attemptedQuestions) ? prog.attemptedQuestions.length : 0;
			const requiredCorrect = topic.requiredCorrectToUnlock || 3;
			const isCompleted = correctCount >= requiredCorrect;

			// Stage 1 is unlocked for everyone. Subsequent stages are unlocked if previous is completed or user is admin
			const isUnlocked = isAdmin || i === 0 || previousStageCompleted;
			const previousTopic = i > 0 ? topics[i - 1] : null;

			roadmap.push({
				topicId: topic._id,
				stageNumber: topic.stageNumber || i + 1,
				order: topic.order || i + 1,
				title: topic.title,
				description: topic.description,
				icon: topic.icon,
				difficulty: topic.difficulty,
				requiredCorrect,
				correctCount,
				attemptedCount,
				progressPercent: Math.min(100, Math.round((correctCount / requiredCorrect) * 100)),
				isCompleted,
				isUnlocked,
				prerequisite: !isUnlocked && previousTopic ? {
					topicId: previousTopic._id,
					stageNumber: previousTopic.stageNumber || i,
					title: previousTopic.title,
					requiredCorrect: previousTopic.requiredCorrectToUnlock || 3,
				} : null,
			});

			previousStageCompleted = isCompleted;
		}

		return res.status(200).json({
			success: true,
			roadmap,
			totalStages: topics.length,
			completedStages: roadmap.filter((r) => r.isCompleted).length,
		});
	} catch (error) {
		console.error("GET ROADMAP PROGRESS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to fetch roadmap progress" });
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

		const currentTopic = await Topic.findById(topicId);
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
				stageCompleted: (existingProgress.correctQuestions?.length || 0) >= (currentTopic?.requiredCorrectToUnlock || 3),
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

		const wasPreviouslyCompleted = (existingProgress?.correctQuestions?.length || 0) >= (currentTopic?.requiredCorrectToUnlock || 3);

		const progress = await Progress.findOneAndUpdate(
			{ user: req.user.userId, topic: topicId },
			update,
			{ new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
		);

		const requiredToUnlock = currentTopic?.requiredCorrectToUnlock || 3;
		const isNowCompleted = (progress.correctQuestions?.length || 0) >= requiredToUnlock;
		const justUnlockedNext = !wasPreviouslyCompleted && isNowCompleted;

		let nextUnlockedStage = null;
		if (justUnlockedNext && currentTopic) {
			const nextTopic = await Topic.findOne({ order: (currentTopic.order || 1) + 1 });
			if (nextTopic) {
				nextUnlockedStage = {
					topicId: nextTopic._id,
					stageNumber: nextTopic.stageNumber,
					title: nextTopic.title,
				};
			}
		}

		const scoreChange = isCorrect ? 10 : -5;
		const currentUser = await User.findById(req.user.userId).select("firstName lastName email role xp level streak dailyGoal preferredTopic");
		const nextXp = Math.max(0, (currentUser?.xp || 0) + scoreChange);
		const nextLevel = getLearningProfile(nextXp, currentUser?.preferredTopic).level;
		const user = await User.findByIdAndUpdate(
			req.user.userId,
			{ $set: { xp: nextXp, level: nextLevel } },
			{ new: true }
		).select("firstName lastName email role xp level streak dailyGoal preferredTopic");

		return res.status(200).json({
			success: true,
			progress,
			daily: dailyResponse(dailyProgress, user?.dailyGoal),
			scoreChange,
			user,
			stageCompleted: isNowCompleted,
			justUnlockedNext,
			nextUnlockedStage,
		});
	} catch (error) {
		console.error("SAVE PROGRESS ERROR:", error);
		return res.status(500).json({ success: false, message: "Failed to save progress" });
	}
};

module.exports = {
	getDailyProgress,
	getLearningProfileForStudent,
	getRoadmapProgress,
	getTopicProgress,
	saveQuestionProgress,
};
