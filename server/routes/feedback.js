const express = require('express');
const router = express.Router();
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const {
  submitFeedback,
  getFeedback,
  toggleFeedbackApproval,
  deleteFeedback
} = require('../controllers/feedbackController');

// Standard POST/GET
router.route('/')
  .post(protect, submitFeedback)
  .get(protect, authorize('admin'), getFeedback);

// Admin moderation actions
router.route('/:id/toggle-approve')
  .patch(protect, authorize('admin'), toggleFeedbackApproval);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteFeedback);

module.exports = router;
