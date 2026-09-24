const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user.userId }).sort({ createdAt: -1 }).limit(20),
      Notification.countDocuments({ recipient: req.user.userId, read: false }),
    ]);
    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to load notifications." });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user.userId },
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("READ NOTIFICATION ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update notification." });
  }
};

module.exports = { getNotifications, markNotificationRead };
