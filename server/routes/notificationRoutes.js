const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getNotifications, markNotificationRead } = require("../controllers/notificationController");

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/:notificationId/read", markNotificationRead);

module.exports = router;
