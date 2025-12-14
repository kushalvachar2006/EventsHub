const express = require('express');
const router = express.Router();
require('../cleanupScheduler');

const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
} = require('../controllers/eventController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Host-only routes
router.post('/', protect, authorize('host'), upload.single('banner'), createEvent);
router.put('/:id', protect, authorize('host'), upload.single('banner'), updateEvent);
router.delete('/:id', protect, authorize('host'), deleteEvent);

module.exports = router;
