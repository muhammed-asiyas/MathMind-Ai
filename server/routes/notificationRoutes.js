const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getNotifications, markNotificationRead, markNotificationsRead } = require("../controllers/notificationController");

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/read-all", markNotificationsRead);
router.patch("/:notificationId/read", markNotificationRead);

module.exports = router;
