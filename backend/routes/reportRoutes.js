const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  exportTaskReport,
  exportUserReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTaskReport); // Export all task as Excel/PDF

router.get("/export/users", protect, adminOnly, exportUserReport); // Export user-task report

module.exports = router;
