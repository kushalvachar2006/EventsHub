const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true,
  },
  reasonForAttending: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approver: { // The HoD/Admin who acted on it
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  requestDate: { type: Date, default: Date.now },
  teamMembers: [
    {
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },
  ],
  feedback: { type: String },
});

module.exports = mongoose.model('PermissionRequest', permissionSchema);