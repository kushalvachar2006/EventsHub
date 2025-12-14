const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  college: { type: String, required: true }, // The college where the event is happening
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bannerUrl: { type: String }, // URL from Cloudinary
  category: { type: String, default: "General" },
  registrationDeadline: { type: Date },
  teamSize: { type: Number }, // Maximum team size
  minTeamSize: { type: Number, default: 1 }, // Minimum team size required
  requireTeamDetails: { type: Boolean, default: false }, // Whether team member details are mandatory
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
