const PermissionRequest = require('../models/permissionModel');
const Registration = require('../models/registrationModel');
const Notification = require('../models/notificationModel');

// @desc    Get pending requests for Admin's college
// @route   GET /api/admin/pending-requests
const getPendingRequests = async (req, res) => {
  try {
    // Find all permission requests where status is pending
    // Populate student to check if they belong to Admin's college
    const requests = await PermissionRequest.find({ status: 'pending' })
      .populate('student', 'name email college department attendancePercentage')
      .populate('event', 'title date location')
      .sort({ requestDate: 1 });

    // Filter manually to show only students from Admin's college
    const collegeRequests = requests.filter(reqObj => 
      reqObj.student.college === req.user.college
    );

    res.status(200).json(collegeRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve request
// @route   POST /api/admin/requests/:reqId/approve
const approvePermission = async (req, res) => {
  try {
    const request = await PermissionRequest.findById(req.params.reqId).populate('student', 'attendancePercentage');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Attendance rule: approve only if >= 75%
    const attendance = Number(request.student?.attendancePercentage ?? 100);
    if (Number.isFinite(attendance) && attendance < 75) {
      return res.status(400).json({ message: 'Attendance below 75%. Cannot approve.' });
    }

    // Update Request
    request.status = 'approved';
    request.approver = req.user.id;
    if (req.body && typeof req.body.feedback === 'string') {
      request.feedback = req.body.feedback;
    }
    await request.save();

    // Update Original Registration
    const registration = await Registration.findById(request.registration);
    if (registration) {
      registration.status = 'approved';
      await registration.save();
    }

    // Notify student
    try {
      await Notification.create({
        recipient: request.student,
        type: 'approval',
        registration: request.registration,
        event: request.event,
        message: 'Your HoD permission request has been approved.',
      });
    } catch {}

    res.status(200).json({ message: 'Approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject request
// @route   POST /api/admin/requests/:reqId/reject
const rejectPermission = async (req, res) => {
  try {
    const request = await PermissionRequest.findById(req.params.reqId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.approver = req.user.id;
    if (req.body && typeof req.body.feedback === 'string') {
      request.feedback = req.body.feedback;
    }
    await request.save();

    const registration = await Registration.findById(request.registration);
    if (registration) {
      registration.status = 'rejected-by-hod';
      await registration.save();
    }

    // Notify student
    try {
      await Notification.create({
        recipient: request.student,
        type: 'hod-rejection',
        registration: request.registration,
        event: request.event,
        message: request.feedback ? `HoD rejected your request: ${request.feedback}` : 'Your HoD permission request was rejected.',
      });
    } catch {}

    res.status(200).json({ message: 'Rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingRequests, approvePermission, rejectPermission };