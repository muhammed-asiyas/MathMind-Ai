const { askAgent } = require("../services/aiAgentService");

const askAI = async (req, res) => {
  try {
    const question = String(req.body.question || "").trim();
    if (!question) return res.status(400).json({ success: false, message: "Please enter a maths question." });
    if (question.length > 2000) return res.status(400).json({ success: false, message: "Please keep your question under 2,000 characters." });

    const result = await askAgent(question);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("ASK AI ERROR:", error);
    return res.status(500).json({ success: false, message: "The AI tutor is temporarily unavailable." });
  }
};

module.exports = { askAI };