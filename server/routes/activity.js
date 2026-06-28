const express = require('express');
const router = express.Router();
const { 
  getMyActivity, 
  getActivitySummary, 
  postHeartbeat, 
  endSession 
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMyActivity);
router.get('/summary', protect, getActivitySummary);
router.post('/heartbeat', protect, postHeartbeat);
router.post('/session/end', protect, endSession);

module.exports = router;
