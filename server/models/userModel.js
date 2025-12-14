const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'host', 'admin'],
    default: 'student',
  },
  college: { type: String, required: true }, // Crucial for filtering
  department: { type: String }, // Useful for HoD logic
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);