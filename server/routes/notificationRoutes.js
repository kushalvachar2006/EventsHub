const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Get all notifications for logged-in user
router.get("/", protect, getNotifications);

// Mark notification as read
router.put("/:id/read", protect, markAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
