const express = require("express");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { getAdminOverview, getAllStudents, addStudent, removeStudent } = require("../controllers/adminController");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/overview", getAdminOverview);
router.get("/students", getAllStudents);
router.post("/students", addStudent);
router.delete("/students/:id", removeStudent);

module.exports = router;
