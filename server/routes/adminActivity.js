const express = require('express');
const router = express.Router();
const { 
  getAdminUsersActivity, 
  getAdminUserDetailActivity,
  getAdminSummary 
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

// Make sure only admins can query these
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAdminUsersActivity);
router.get('/summary', getAdminSummary);
router.get('/:userId', getAdminUserDetailActivity);

module.exports = router;
