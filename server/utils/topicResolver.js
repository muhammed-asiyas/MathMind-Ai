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
	if (!identifier) return null;

	if (typeof identifier === "string" && mongoose.isObjectIdOrHexString(identifier) && identifier.length === 24) {
		const byId = await Topic.findById(identifier);
		if (byId) return byId;
	}

	const rawIdentifier = normalizeTopicName(identifier);
	const normalizedIdentifier = topicAliases[rawIdentifier] || rawIdentifier;
	if (!normalizedIdentifier) return null;

	const topics = await Topic.find().select("_id title").lean();
	// Exact normalized title match
	const exactMatch = topics.find((topic) => normalizeTopicName(topic.title) === normalizedIdentifier);
	if (exactMatch) return Topic.findById(exactMatch._id);

	// Alias or substring match
	const partialMatch = topics.find((topic) =>
		normalizeTopicName(topic.title).includes(normalizedIdentifier) ||
		normalizedIdentifier.includes(normalizeTopicName(topic.title))
	);
	if (partialMatch) return Topic.findById(partialMatch._id);

	return null;
};

module.exports = { resolveTopic };
