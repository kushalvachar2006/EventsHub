const Event = require("../models/eventModel");
const Registration = require("../models/registrationModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const PermissionRequest = require("../models/permissionModel");

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
    const registration = await Registration.findById(regId)
      .populate("event")
      .populate("student", "name email department college");

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

    // Auto-create HoD permission request with default letter template
    try {
      // Build team member names list (leader first if available)
      const memberNames = [];
      if (registration.teamLeader && registration.teamLeader.name) {
        memberNames.push(registration.teamLeader.name);
      }
      if (Array.isArray(registration.teamMembers)) {
        registration.teamMembers.forEach((m) => {
          if (m && m.name) memberNames.push(m.name);
        });
      }

      // Contact line: prefer email and a contact number if available
      const contactParts = [];
      if (registration.student?.email) contactParts.push(registration.student.email);
      const leaderPhone = registration.teamLeader?.phoneNumber;
      const studentPhone = registration.student?.phoneNumber;
      if (leaderPhone) contactParts.push(leaderPhone);
      else if (studentPhone) contactParts.push(studentPhone);

      const studentName = registration.student?.name || 'Student';
      const departmentName = registration.student?.department || 'Department';
      const collegeName = registration.student?.college || '';
      const eventTitle = registration.event?.title || 'Event';
      const eventDateStr = registration.event?.date ? new Date(registration.event.date).toLocaleString() : '';

      const letter = [
        `Subject: Permission Request to Participate in ${eventTitle}`,
        '',
        'Respected Head of the Department,',
        '',
        'I hope this letter finds you in good health and high spirits.',
        '',
        `I, ${studentName}, a student of the ${departmentName} department at ${collegeName}, respectfully request your kind permission to participate in the event titled "${eventTitle}", which is scheduled to be held on ${eventDateStr}.`,
        '',
        'This event provides an excellent opportunity for learning, skill development, and exposure beyond the classroom. Participation in such activities will contribute positively to my academic and professional growth.',
        '',
        `Team Name: ${registration.teamName || 'N/A'}`,
        'Team Members:',
        ...memberNames.map((n, idx) => `* ${n}`),
        '',
        'I assure you that my participation in this event will not interfere with my academic responsibilities. I will make sure to complete all assignments, attend missed classes as required, and maintain discipline and academic integrity.',
        '',
        'I kindly request you to grant me permission to attend the event and oblige. I shall be extremely grateful for your support and encouragement.',
        '',
        'Thanking you in anticipation.',
        '',
        'Yours sincerely,',
        studentName,
        departmentName,
        collegeName,
        contactParts.join(' / '),
      ].join('\n');

      await PermissionRequest.create({
        student: registration.student._id || registration.student,
        event: registration.event._id,
        registration: registration._id,
        reasonForAttending: letter,
        teamMembers: Array.isArray(registration.teamMembers)
          ? registration.teamMembers.map(m => ({ name: m.name, email: m.email, role: '' }))
          : [],
      });

      // Update registration to awaiting HoD approval
      registration.status = "awaiting-hod-approval";
      await registration.save();

      // Notify student that HoD request was auto-submitted
      await Notification.create({
        recipient: registration.student._id || registration.student,
        type: "selection",
        registration: registration._id,
        event: registration.event._id,
        message: `Your team has been selected for "${registration.event.title}". A permission letter has been auto-submitted to your HoD for approval.`,
      });
    } catch (autoErr) {
      // Fallback to original notification if auto-create fails
      await Notification.create({
        recipient: registration.student._id || registration.student,
        type: "selection",
        registration: registration._id,
        event: registration.event._id,
        message: `Your team has been selected for "${registration.event.title}". Please fill the permission form to proceed.`,
      });
    }

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
    // set TTL anchor so this registration auto-deletes after 12 hours
    registration.rejectedAt = new Date();
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
