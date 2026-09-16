const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Topic",
			required: true,
		},
		lesson: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lesson",
		},
		questionIndex: { type: Number, required: true, min: 0 },
		difficulty: {
			type: String,
			enum: ["Beginner", "Intermediate", "Hard"],
			default: "Beginner",
		},
		prompt: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
		hint: { type: String, required: true, trim: true },
	},
	{ timestamps: true }
);

questionSchema.index({ topic: 1, questionIndex: 1 });
questionSchema.index({ lesson: 1, questionIndex: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Question", questionSchema);
