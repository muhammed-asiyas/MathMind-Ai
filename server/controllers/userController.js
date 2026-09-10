const User = require("../models/User");

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
  getProfile,
  updateProfile,
};