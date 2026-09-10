const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
	{
		topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Topic",
			required: true,
		},
		title: { type: String, required: true, trim: true },
		questionSetKey: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		content: { type: String, default: "" },
		videoUrl: { type: String, default: "", trim: true },
		difficulty: {
			type: String,
			enum: ["Beginner", "Intermediate", "Advanced"],
			default: "Beginner",
		},
		order: { type: Number, default: 0 },
		duration: { type: Number, default: 10, min: 1 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
