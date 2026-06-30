const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res) => {
  try {
    const { rating, feedbackText } = req.body;

    // Validation
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
    }

    if (!feedbackText || !feedbackText.trim()) {
      return res.status(400).json({ success: false, message: 'Feedback text is required' });
    }

    if (feedbackText.length > 500) {
      return res.status(400).json({ success: false, message: 'Feedback text cannot exceed 500 characters' });
    }

    // 24-hour anti-spam check
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const lastFeedback = await Feedback.findOne({
      userId: req.user._id,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (lastFeedback) {
      const msLeft = (lastFeedback.createdAt.getTime() + 24 * 60 * 60 * 1000) - Date.now();
      const minutesLeft = Math.ceil(msLeft / (60 * 1000));
      const hours = Math.floor(minutesLeft / 60);
      const minutes = minutesLeft % 60;
      
      let waitMsg = `You have already submitted feedback in the last 24 hours. `;
      if (hours > 0) {
        waitMsg += `Please try again in ${hours}h ${minutes}m.`;
      } else {
        waitMsg += `Please try again in ${minutes}m.`;
      }

      return res.status(429).json({
        success: false,
        message: waitMsg
      });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      rating: numericRating,
      feedbackText: feedbackText.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback reviews (Public approved, Admin gets all with filter)
// @route   GET /api/feedback
// @access  Public / Optional Private
const getFeedback = async (req, res) => {
  try {
    const { rating } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';
    let query = {};

    if (!isAdmin) {
      // Public display: only approved reviews
      query.isApproved = true;
    } else {
      // Admin display: can filter by rating
      if (rating && rating !== 'all') {
        const numRating = Number(rating);
        if (!isNaN(numRating)) {
          query.rating = numRating;
        }
      }
    }

    let feedbackQuery = Feedback.find(query);

    // If admin, populate user info (name, email, role, avatar, active domain)
    if (isAdmin) {
      feedbackQuery = feedbackQuery.populate({
        path: 'userId',
        select: 'fullName email role avatar activeDomain',
        populate: {
          path: 'activeDomain',
          select: 'name'
        }
      });
    } else {
      // Public testimonials can still benefit from simple user name population
      feedbackQuery = feedbackQuery.populate({
        path: 'userId',
        select: 'fullName avatar'
      });
    }

    const feedbackList = await feedbackQuery.sort({ createdAt: -1 });

    // Calculate global metrics from approved reviews
    const allApproved = await Feedback.find({ isApproved: true });
    const totalReviews = allApproved.length;
    const sumRating = allApproved.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : '0.0';

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      averageRating: Number(averageRating),
      totalReviews,
      data: feedbackList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle feedback approval status
// @route   PATCH /api/feedback/:id/toggle-approve
// @access  Private/Admin
const toggleFeedbackApproval = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback review not found' });
    }

    feedback.isApproved = !feedback.isApproved;
    await feedback.save();

    res.status(200).json({
      success: true,
      message: `Feedback is now ${feedback.isApproved ? 'approved' : 'hidden'}`,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a feedback review
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback review not found' });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  toggleFeedbackApproval,
  deleteFeedback
};
