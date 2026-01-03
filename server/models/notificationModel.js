const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "selection",
      "rejection",
      "approval",
      "hod-rejection",
      "registration",
    ],
    required: true,
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  // When set, MongoDB TTL index will remove this document after the given time
  deleteAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// TTL index on deleteAt: document expires when deleteAt is reached
notificationSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
