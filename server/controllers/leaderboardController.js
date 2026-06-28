const Leaderboard = require('../models/Leaderboard');
const LeaderboardSettings = require('../models/LeaderboardSettings');
const { recalculateRankings } = require('../services/gamificationService');

// Helper to calculate rank details for user
async function getUserRankDetails(userId, scope = 'global', filterVal = null) {
  try {
    let query = {};
    let sortField = 'points';
    let rankField = 'rank';

    if (scope === 'weekly') {
      sortField = 'weeklyPoints';
      rankField = 'weeklyRank';
    } else if (scope === 'monthly') {
      sortField = 'monthlyPoints';
      rankField = 'monthlyRank';
    } else if (scope === 'course' && filterVal) {
      query.courseId = filterVal;
    } else if (scope === 'batch' && filterVal) {
      query.batchId = filterVal;
    }

    const myEntry = await Leaderboard.findOne({ userId });
    if (!myEntry) {
      return { rank: 0, points: 0, level: 1 };
    }

    // Dynamic rank count
    let myRank = myEntry[rankField];
    if (scope === 'course' || scope === 'batch') {
      const allFilter = await Leaderboard.find(query).sort({
        [sortField]: -1,
        averageAssessmentScore: -1,
        totalStudyTime: -1
      });
      const idx = allFilter.findIndex(u => u.userId.toString() === userId.toString());
      myRank = idx !== -1 ? idx + 1 : 0;
    }

    return {
      rank: myRank,
      points: myEntry[sortField] || 0,
      level: myEntry.level || 1,
      totalPoints: myEntry.points || 0,
      badgesCount: myEntry.badges?.length || 0
    };
  } catch (err) {
    console.error('Error in getUserRankDetails:', err.message);
    return { rank: 0, points: 0, level: 1 };
  }
}

// @desc    Get global leaderboard (top 10 + user rank)
// @route   GET /api/leaderboard/global
// @access  Private
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const topTen = await Leaderboard.find()
      .sort({ rank: 1 })
      .limit(10)
      .populate('userId', 'fullName avatar')
      .lean();

    const myRankInfo = await getUserRankDetails(req.user._id, 'global');

    res.json({ success: true, data: { topTen, myRankInfo } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get course leaderboard
// @route   GET /api/leaderboard/course/:courseId
// @access  Private
exports.getCourseLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    const topTen = await Leaderboard.find({ courseId })
      .sort({ points: -1, averageAssessmentScore: -1 })
      .limit(10)
      .populate('userId', 'fullName avatar')
      .lean();

    const myRankInfo = await getUserRankDetails(req.user._id, 'course', courseId);

    res.json({ success: true, data: { topTen, myRankInfo } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get batch leaderboard
// @route   GET /api/leaderboard/batch/:batchId
// @access  Private
exports.getBatchLeaderboard = async (req, res) => {
  try {
    const { batchId } = req.params;
    const topTen = await Leaderboard.find({ batchId })
      .sort({ points: -1, averageAssessmentScore: -1 })
      .limit(10)
      .populate('userId', 'fullName avatar')
      .lean();

    const myRankInfo = await getUserRankDetails(req.user._id, 'batch', batchId);

    res.json({ success: true, data: { topTen, myRankInfo } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get weekly leaderboard
// @route   GET /api/leaderboard/weekly
// @access  Private
exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    const topTen = await Leaderboard.find()
      .sort({ weeklyRank: 1 })
      .limit(10)
      .populate('userId', 'fullName avatar')
      .lean();

    const myRankInfo = await getUserRankDetails(req.user._id, 'weekly');

    res.json({ success: true, data: { topTen, myRankInfo } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get monthly leaderboard
// @route   GET /api/leaderboard/monthly
// @access  Private
exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const topTen = await Leaderboard.find()
      .sort({ monthlyRank: 1 })
      .limit(10)
      .populate('userId', 'fullName avatar')
      .lean();

    const myRankInfo = await getUserRankDetails(req.user._id, 'monthly');

    res.json({ success: true, data: { topTen, myRankInfo } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get personal gamified stats & level progress
// @route   GET /api/leaderboard/me
// @access  Private
exports.getMyLeaderboardStats = async (req, res) => {
  try {
    let entry = await Leaderboard.findOne({ userId: req.user._id });
    if (!entry) {
      entry = await Leaderboard.create({
        userId: req.user._id,
        fullName: req.user.fullName,
        avatar: req.user.avatar || '',
        points: 0
      });
    }

    // Determine target boundaries to next level
    // Level 1 : 0–100 points
    // Level 2 : 101–300 points
    // Level 3 : 301–600 points
    // Level 4 : 601–1000 points
    // Level 5 : 1001–1500 points
    // Level 6 : 1500+ points
    let currentMin = 0;
    let nextMax = 100;
    
    if (entry.level === 2) {
      currentMin = 101;
      nextMax = 300;
    } else if (entry.level === 3) {
      currentMin = 301;
      nextMax = 600;
    } else if (entry.level === 4) {
      currentMin = 601;
      nextMax = 1000;
    } else if (entry.level === 5) {
      currentMin = 1001;
      nextMax = 1500;
    } else if (entry.level === 6) {
      currentMin = 1500;
      nextMax = 1500; // maxed out
    }

    const pointsInCurrentLevel = Math.max(0, entry.points - currentMin);
    const range = nextMax - currentMin;
    const progressPercent = range > 0 ? Math.min(100, Math.round((pointsInCurrentLevel / range) * 100)) : 100;

    res.json({
      success: true,
      data: {
        points: entry.points,
        weeklyPoints: entry.weeklyPoints,
        monthlyPoints: entry.monthlyPoints,
        level: entry.level,
        rank: entry.rank,
        weeklyRank: entry.weeklyRank,
        monthlyRank: entry.monthlyRank,
        badges: entry.badges,
        nextLevelPoints: nextMax,
        pointsRemaining: Math.max(0, nextMax - entry.points),
        progressPercent,
        stats: {
          totalStudyTime: entry.totalStudyTime,
          totalLoginCount: entry.totalLoginCount,
          loginStreak: entry.loginStreak,
          videosCompleted: entry.videosCompleted,
          assessmentsAttempted: entry.assessmentsAttempted,
          assessmentsPassed: entry.assessmentsPassed,
          averageAssessmentScore: entry.averageAssessmentScore,
          codingProblemsSolved: entry.codingProblemsSolved
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Force recalculate leaderboard rankings (Admin only)
// @route   POST /api/admin/leaderboard/recalculate
// @access  Private/Admin
exports.adminRecalculate = async (req, res) => {
  try {
    await recalculateRankings();
    res.json({ success: true, message: 'Rankings successfully recalculated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reset leaderboard weekly or monthly points (Admin only)
// @route   POST /api/admin/leaderboard/reset
// @access  Private/Admin
exports.adminReset = async (req, res) => {
  try {
    const { resetType } = req.body; // 'weekly' or 'monthly'
    if (resetType !== 'weekly' && resetType !== 'monthly') {
      return res.status(400).json({ success: false, message: 'Invalid resetType. Must be weekly or monthly.' });
    }

    const field = resetType === 'weekly' ? 'weeklyPoints' : 'monthlyPoints';
    const rankField = resetType === 'weekly' ? 'weeklyRank' : 'monthlyRank';

    await Leaderboard.updateMany({}, { $set: { [field]: 0, [rankField]: 0 } });
    await recalculateRankings();

    res.json({ success: true, message: `Successfully reset ${resetType} leaderboard metrics.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get leaderboard settings and points rule configurations (Admin only)
// @route   GET /api/admin/leaderboard/settings
// @access  Private/Admin
exports.adminGetSettings = async (req, res) => {
  try {
    let settings = await LeaderboardSettings.findOne();
    if (!settings) {
      const defaultBadges = [
        { key: 'first_login', name: 'First Login', icon: '👋', description: 'Initiated the onboarding journey', isActive: true },
        { key: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Log in 7 days in a row', isActive: true },
        { key: 'streak_30', name: '30 Day Streak', icon: '⚡', description: 'Log in 30 days in a row', isActive: true },
        { key: 'study_100', name: '100 Hours Studied', icon: '🧠', description: 'Invested 100 hours in learning', isActive: true },
        { key: 'top_performer', name: 'Top Performer', icon: '👑', description: 'Reached top 3 on the Leaderboard', isActive: true },
        { key: 'coding_champion', name: 'Coding Champion', icon: '🧗', description: 'Solve 10 coding challenges', isActive: true },
        { key: 'assessment_master', name: 'Assessment Master', icon: '🎯', description: 'Pass 5 assessments successfully', isActive: true },
        { key: 'perfect_attendance', name: 'Perfect Attendance', icon: '📅', description: 'Log in 50 times total', isActive: true },
        { key: 'video_master', name: 'Video Completion Master', icon: '🎬', description: 'Watch 10 complete video tutorials', isActive: true },
        { key: 'roadmap_finisher', name: 'Roadmap Finisher', icon: '🏆', description: 'Complete a full career specialization path', isActive: true }
      ];
      settings = await LeaderboardSettings.create({
        pointSystem: {},
        badges: defaultBadges
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update points weights and badges settings (Admin only)
// @route   PUT /api/admin/leaderboard/settings
// @access  Private/Admin
exports.adminUpdateSettings = async (req, res) => {
  try {
    const { pointSystem, badges } = req.body;
    let settings = await LeaderboardSettings.findOne();
    if (!settings) {
      settings = new LeaderboardSettings();
    }

    if (pointSystem) settings.pointSystem = pointSystem;
    if (badges) settings.badges = badges;

    await settings.save();
    res.json({ success: true, message: 'Gamification rules updated successfully!', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
