const express = require('express');
const router = express.Router();
const { getPendingRequests, approvePermission, rejectPermission } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/pending-requests', getPendingRequests);
router.post('/requests/:reqId/approve', approvePermission);
router.post('/requests/:reqId/reject', rejectPermission);

module.exports = router;