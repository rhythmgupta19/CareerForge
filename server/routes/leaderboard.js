const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getGlobalLeaderboard,
  getCourseLeaderboard,
  getBatchLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getMyLeaderboardStats,
  adminRecalculate,
  adminReset,
  adminGetSettings,
  adminUpdateSettings
} = require('../controllers/leaderboardController');

// All routes require authentication
router.use(protect);

// Student routes
router.get('/global', getGlobalLeaderboard);
router.get('/course/:courseId', getCourseLeaderboard);
router.get('/batch/:batchId', getBatchLeaderboard);
router.get('/weekly', getWeeklyLeaderboard);
router.get('/monthly', getMonthlyLeaderboard);
router.get('/me', getMyLeaderboardStats);

// Admin-only management endpoints
router.post('/admin/recalculate', authorize('admin'), adminRecalculate);
router.post('/admin/reset', authorize('admin'), adminReset);
router.get('/admin/settings', authorize('admin'), adminGetSettings);
router.put('/admin/settings', authorize('admin'), adminUpdateSettings);

module.exports = router;
