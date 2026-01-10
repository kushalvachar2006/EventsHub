const mongoose = require('mongoose');
const Event = require('./models/eventModel');
const Registration = require('./models/registrationModel');
const PermissionRequest = require('./models/permissionModel');

const startCleanup = () => {
  const cleanupExpiredEvents = async () => {
    try {
      const now = new Date();
      // Consider events expired if either registrationDeadline has passed OR event date has passed
      const expiredEvents = await Event.find({
        $or: [
          { registrationDeadline: { $ne: null, $lt: now } },
          { date: { $lt: now } },
        ],
      }).select('_id');

      if (expiredEvents.length) {
        const ids = expiredEvents.map((e) => e._id);
        // Cascade delete related data first
        const regDel = await Registration.deleteMany({ event: { $in: ids } });
        const permDel = await PermissionRequest.deleteMany({ event: { $in: ids } });
        const evtDel = await Event.deleteMany({ _id: { $in: ids } });
        console.log(
          `Cleanup: deleted ${evtDel.deletedCount} events, ${regDel.deletedCount} registrations, ${permDel.deletedCount} permission requests`
        );
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
