const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Question = require("./models/Question");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const topicRoutes = require("./routes/topicRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quizRoutes = require("./routes/quizRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// Home
app.get("/", (req, res) => {
  res.json({
    message: "MathMind AI API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

const ensureQuestionIndexes = async () => {
  const indexes = await Question.collection.indexes();
  const legacyIndex = indexes.find((index) => index.name === "topic_1_questionIndex_1" && index.unique);
  if (legacyIndex) {
    await Question.collection.dropIndex(legacyIndex.name);
    await Question.syncIndexes();
  }
};

const startServer = async () => {
  await connectDB();
  await ensureQuestionIndexes();

  app.listen(PORT, () => {
    console.log(`MathMind AI server running on port ${PORT}`);
  });
};

startServer();