const mongoose = require("mongoose");
const Topic = require("../models/Topic");

const normalizeTopicName = (value) => String(value ?? "")
	.toLowerCase()
	.replace(/[^a-z0-9]/g, "");

const topicAliases = {
	arithmetic: "basicmathsarithmetic",
	fractions: "fractionsdecimals",
	algebra: "prealgebraequations",
	geometry: "geometryspatialmeasurement",
	statistics: "statisticsprobability",
};

const resolveTopic = async (identifier) => {
	if (typeof identifier === "string" && mongoose.isObjectIdOrHexString(identifier)) {
		return Topic.findById(identifier);
	}

	const rawIdentifier = normalizeTopicName(identifier);
	const normalizedIdentifier = topicAliases[rawIdentifier] || rawIdentifier;
	if (!normalizedIdentifier) return null;

	const topics = await Topic.find().select("_id title").lean();
	const matches = topics.filter((topic) => normalizeTopicName(topic.title) === normalizedIdentifier);

	return matches.length === 1 ? Topic.findById(matches[0]._id) : null;
};

module.exports = { resolveTopic };
