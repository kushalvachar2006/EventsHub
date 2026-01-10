const Registration = require('../models/registrationModel');
const PermissionRequest = require('../models/permissionModel');
const Event = require('../models/eventModel');
const Notification = require('../models/notificationModel');

// @desc    Register for an event
// @route   POST /api/student/register/:id
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user.id;
    const teamMembers = Array.isArray(req.body?.teamMembers) ? req.body.teamMembers : [];
    const teamName = typeof req.body?.teamName === 'string' ? req.body.teamName : '';
    const leader = req.body?.teamLeader && typeof req.body.teamLeader === 'object' ? req.body.teamLeader : null;

    // Enforce deadline if present
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({ event: eventId, student: studentId });
    if (existingReg) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Determine if this event requires team registration
    const isTeamFlow =
      event.category === 'Hackathon' ||
      (event.category === 'Competition' && !!event.isTeamCompetition);

    // Enforce capacity based on registrationLimit (when provided)
    if (typeof event.registrationLimit === 'number' && event.registrationLimit > 0) {
      // Count already accepted registrations; for individual flow we auto-approve, for team flow host may approve later
      // Consider selected, awaiting-hod-approval, approved as consuming capacity
      const acceptedCount = await Registration.countDocuments({
        event: eventId,
        status: { $in: ['selected', 'awaiting-hod-approval', 'approved'] },
      });
      if (acceptedCount >= event.registrationLimit) {
        return res.status(400).json({ message: 'Registrations are full for this event' });
      }
    }

    // Create base registration document
    const baseDoc = {
      event: eventId,
      student: studentId,
      status: 'pending',
      teamName,
      teamLeader: leader
        ? {
            name: leader.name || '',
            email: leader.email || '',
            phoneNumber: leader.phoneNumber || '',
          }
        : undefined,
      teamMembers: teamMembers.map((m) => ({
        name: m?.name || '',
        email: m?.email || '',
        phoneNumber: m?.phoneNumber || '',
      })),
    };

    // For individual registrations, do not auto-approve. HoD approval is mandatory.
    const registration = await Registration.create(baseDoc);

    // Notify host about new registration
    try {
      if (event?.host) {
        const message = `${req.user?.name || 'A student'} registered for ${event.title || 'your event'}`;
        await Notification.create({
          recipient: event.host,
          type: 'registration',
          registration: registration._id,
          event: event._id,
          message,
        });
      }
    } catch (notifyErr) {
      // non-blocking
    }
    
    // For individual flow, immediately create HoD permission request using revised individual letter
    if (!isTeamFlow) {
      try {
        const studentName = req.user?.name || 'Student';
        const dept = req.user?.department || 'Department';
        const college = req.user?.college ? ` (${req.user.college})` : '';
        const studentEmail = req.user?.email || '';
        const eventTitle = event?.title || 'Event';
        const eventDateStr = event?.date ? new Date(event.date).toLocaleString() : '';

        const letter = [
          `Subject: Request for Approval – Individual Registration for ${eventTitle}`,
          '',
          'Respected HoD,',
          '',
          `I, ${studentName}, from ${dept}${college}, request approval to participate individually in the event "${eventTitle}" scheduled on ${eventDateStr}.`,
          '',
          'I confirm that my academic schedule and attendance requirements will be maintained and I will adhere to the institutional code of conduct during the event.',
          '',
          'I kindly request your approval.',
          '',
          'Sincerely,',
          `${studentName}`,
          `${studentEmail}`,
        ].join('\n');

        await PermissionRequest.create({
          student: req.user.id,
          event: event._id,
          registration: registration._id,
          reasonForAttending: letter,
          teamMembers: [],
        });

        // Update registration status to awaiting HoD approval
        registration.status = 'awaiting-hod-approval';
        await registration.save();

        // Notify student that HoD request was submitted
        try {
          await Notification.create({
            recipient: req.user.id,
            type: 'selection',
            registration: registration._id,
            event: event._id,
            message: `Your registration for "${eventTitle}" has been submitted for HoD approval.`,
          });
        } catch (e) {}
      } catch (autoErr) {
        // If auto-create fails, leave registration as pending and let student use form
      }
    }

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in student's registrations
// @route   GET /api/student/my-registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.id })
      .populate('event') // Get full event details
      .sort({ registrationDate: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit permission form to HoD
// @route   POST /api/student/request-permission
const submitPermissionForm = async (req, res) => {
  const { registrationId, reasonForAttending, teamMembers } = req.body;

  try {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify status allows request
    if (registration.status !== 'selected') {
      return res.status(400).json({ message: 'You can only request permission if selected by the host' });
    }

    // Create permission request
    const permission = await PermissionRequest.create({
      student: req.user.id,
      event: registration.event,
      registration: registrationId,
      reasonForAttending,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    });

    // Update registration status
    registration.status = 'awaiting-hod-approval';
    await registration.save();

    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, submitPermissionForm };