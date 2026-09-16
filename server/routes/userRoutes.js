const express = require("express");

const protect = require("../middleware/authMiddleware");
const { getLeaderboard, getProfile, updateProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/leaderboard", protect, getLeaderboard);
router.put("/profile", protect, updateProfile);

module.exports = router;