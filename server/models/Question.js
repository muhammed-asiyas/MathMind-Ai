const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Topic",
			required: true,
		},
		questionIndex: { type: Number, required: true, min: 0 },
		prompt: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
		hint: { type: String, required: true, trim: true },
	},
	{ timestamps: true }
);

questionSchema.index({ topic: 1, questionIndex: 1 }, { unique: true });

module.exports = mongoose.model("Question", questionSchema);
