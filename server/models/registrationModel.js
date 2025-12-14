const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending", // Applied, waiting for Host
      "selected", // Host selected, student needs HoD permission
      "not-selected", // Host rejected
      "awaiting-hod-approval", // Form filled, waiting for HoD
      "approved", // Final HoD approval
      "rejected-by-hod", // HoD rejected
    ],
    default: "pending",
  },
  teamName: { type: String },
  teamLeader: {
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
  },
  teamMembers: [
    {
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
  ],
  feedback: { type: String }, // Host's feedback on rejection or selection
  registrationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", registrationSchema);
