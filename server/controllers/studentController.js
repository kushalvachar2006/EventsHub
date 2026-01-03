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

    const registration = await Registration.create({
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
      teamMembers: teamMembers.map(m => ({
        name: m?.name || '',
        email: m?.email || '',
        phoneNumber: m?.phoneNumber || '',
      })),
    });

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