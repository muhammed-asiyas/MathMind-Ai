const { askAgent } = require("../services/aiAgentService");
const { recognizeHandwriting } = require("../services/aiService");

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

const recognizeHandwritingController = async (req, res) => {
  const { imageDataUrl } = req.body;
  const imageMatch = typeof imageDataUrl === "string"
    ? imageDataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/)
    : null;

  if (!imageMatch) {
    return res.status(400).json({ success: false, message: "A valid PNG handwriting image is required." });
  }

  if (Buffer.from(imageMatch[1], "base64").byteLength > 1024 * 1024) {
    return res.status(413).json({ success: false, message: "The handwriting image is too large. Please try again." });
  }

  try {
    const result = await recognizeHandwriting(imageDataUrl);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("HANDWRITING RECOGNITION ERROR:", error);
    const statusCode = error.statusCode || 502;
    const message = statusCode === 503
      ? error.message
      : "Handwriting recognition is temporarily unavailable. Please type your answer instead.";
    return res.status(statusCode).json({ success: false, message });
  }
};

module.exports = { askAI, recognizeHandwriting: recognizeHandwritingController };