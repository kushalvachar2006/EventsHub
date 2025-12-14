const Event = require("../models/eventModel");
const Registration = require("../models/registrationModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

exports.getMyHostedEvents = async (req, res) => {
  try {
    const events = await Event.find({ host: req.user.id }).sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getRegistrationsForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event || event.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const registrations = await Registration.find({ event: id }).populate(
      "student",
      "name email department college"
    );

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.selectStudent = async (req, res) => {
  try {
    const { regId } = req.params;
    const registration = await Registration.findById(regId).populate("event");

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    if (registration.event.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const feedback =
      typeof req.body?.feedback === "string" ? req.body.feedback : "";

    registration.status = "selected";
    if (feedback) registration.feedback = feedback;
    await registration.save();

    // Create notification for the student
    await Notification.create({
      recipient: registration.student,
      type: "selection",
      registration: registration._id,
      event: registration.event._id,
      message: `Your team has been selected for "${registration.event.title}". Please fill the permission form to proceed.`,
    });

    res.status(200).json({
      success: true,
      message: "Student selected successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.rejectStudent = async (req, res) => {
  try {
    const { regId } = req.params;
    const registration = await Registration.findById(regId).populate("event");

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    if (registration.event.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const feedback =
      typeof req.body?.feedback === "string" ? req.body.feedback : "";

    registration.status = "not-selected";
    if (feedback) registration.feedback = feedback;
    await registration.save();

    // Create notification for the student
    const notificationMessage = feedback
      ? `Your team's registration for "${registration.event.title}" has been rejected. Reason: ${feedback}`
      : `Your team's registration for "${registration.event.title}" has been rejected.`;

    await Notification.create({
      recipient: registration.student,
      type: "rejection",
      registration: registration._id,
      event: registration.event._id,
      message: notificationMessage,
    });

    res.status(200).json({
      success: true,
      message: "Registration rejected",
      registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
