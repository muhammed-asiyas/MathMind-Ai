const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("firstName lastName xp level streak")
      .sort({ xp: -1, streak: -1, createdAt: 1 })
      .lean();

    const rankedStudents = students.map((student, index) => ({
      id: String(student._id),
      name: `${student.firstName} ${student.lastName?.charAt(0) || ""}.`.trim(),
      xp: student.xp || 0,
      level: student.level || 1,
      streak: student.streak || 0,
      rank: index + 1,
    }));

    const currentUserId = String(req.user.userId);
    const currentStudent = rankedStudents.find((student) => student.id === currentUserId) || null;
    const topStudents = rankedStudents.slice(0, 10);

    if (currentStudent && !topStudents.some((student) => student.id === currentUserId)) {
      topStudents.push(currentStudent);
    }

    return res.status(200).json({
      success: true,
      period: "all-time",
      students: topStudents,
      currentStudent,
      totalStudents: rankedStudents.length,
    });
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to load leaderboard" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, preferredTopic, dailyGoal } = req.body;
    const updates = {};

    if (typeof firstName === "string" && firstName.trim()) updates.firstName = firstName.trim();
    if (typeof lastName === "string" && lastName.trim()) updates.lastName = lastName.trim();
    if (typeof preferredTopic === "string" && preferredTopic.trim()) updates.preferredTopic = preferredTopic.trim();
    if ([5, 10, 15, 20].includes(Number(dailyGoal))) updates.dailyGoal = Number(dailyGoal);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

module.exports = {
  getLeaderboard,
  getProfile,
  updateProfile,
};