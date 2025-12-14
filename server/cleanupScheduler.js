const mongoose = require('mongoose');
const Event = require('./models/eventModel');

const startCleanup = () => {
  const cleanupExpiredEvents = async () => {
    try {
      const now = new Date();
      const result = await Event.deleteMany({
        registrationDeadline: { $ne: null, $lt: now },
      });
      if (result && result.deletedCount) {
        console.log(`Cleanup: deleted ${result.deletedCount} expired events`);
      }
    } catch (e) {
      console.error('Cleanup error:', e.message);
    }
  };

  // Run immediately and then every hour
  cleanupExpiredEvents();
  setInterval(cleanupExpiredEvents, 60 * 60 * 1000);
};

if (mongoose.connection.readyState === 1) {
  startCleanup();
} else {
  mongoose.connection.once('connected', startCleanup);
}

module.exports = {};
