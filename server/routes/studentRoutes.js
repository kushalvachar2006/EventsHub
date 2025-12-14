const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, submitPermissionForm } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protection and role check to all routes
router.use(protect);
router.use(authorize('student'));

router.post('/register/:id', registerForEvent); // :id is eventId
router.get('/my-registrations', getMyRegistrations);
router.post('/request-permission', submitPermissionForm);

module.exports = router;