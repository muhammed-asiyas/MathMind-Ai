const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Topic",
			required: true,
		},
		attemptedQuestions: {
			type: [Number],
			default: [],
		},
		correctQuestions: {
			type: [Number],
			default: [],
		},
	},
	{ timestamps: true }
);

progressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
