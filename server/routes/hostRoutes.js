const express = require('express');
const router = express.Router();
const { getMyHostedEvents, getRegistrationsForEvent, selectStudent, rejectStudent } = require('../controllers/hostController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('host'));

router.get('/my-events', getMyHostedEvents);
router.get('/events/:id/registrations', getRegistrationsForEvent);
router.post('/registrations/:regId/select', selectStudent);
router.post('/registrations/:regId/reject', rejectStudent);

module.exports = router;