const UserActivity = require('../models/UserActivity');
const User = require('../models/User');

// Helper to parse device
function parseDevice(ua) {
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

// Helper to parse browser
function parseBrowser(ua) {
  const uaLower = ua.toLowerCase();
  if (uaLower.includes('chrome') || uaLower.includes('crios')) return 'Chrome';
  if (uaLower.includes('firefox')) return 'Firefox';
  if (uaLower.includes('safari') && !uaLower.includes('chrome')) return 'Safari';
  if (uaLower.includes('edge')) return 'Edge';
  if (uaLower.includes('trident') || uaLower.includes('msie')) return 'IE';
  return 'Other';
}

// Record Login (called inside authController)
exports.recordLogin = async (userId, req) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const todayStr = new Date().toISOString().split('T')[0];
    let activity = await UserActivity.findOne({ userId });

    if (!activity) {
      activity = new UserActivity({
        userId,
        role: user.role || 'student',
        totalLoginCount: 1,
        totalSessions: 1,
        currentSessionStart: new Date(),
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
        lastLoginDate: todayStr,
        currentLoginStreak: 1
      });
    } else {
      activity.totalLoginCount += 1;
      activity.totalSessions += 1;
      activity.currentSessionStart = new Date();
      activity.lastLoginAt = new Date();
      activity.lastActiveAt = new Date();

      if (activity.lastLoginDate) {
        const lastDate = new Date(activity.lastLoginDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          activity.currentLoginStreak += 1;
        } else if (diffDays > 1) {
          activity.currentLoginStreak = 1;
        }
      } else {
        activity.currentLoginStreak = 1;
      }
      activity.lastLoginDate = todayStr;
    }

    const ua = req.headers['user-agent'] || '';
    activity.deviceInfo = parseDevice(ua);
    activity.browserInfo = parseBrowser(ua);
    activity.ipAddress = req.ip || req.headers['x-forwarded-for'] || '';

    await activity.save();

    // Trigger Gamification points allocation
    try {
      const { awardPoints } = require('../services/gamificationService');
      await awardPoints(userId, 'login', todayStr);
      
      if (activity.currentLoginStreak > 1) {
        await awardPoints(userId, 'streak', `${todayStr}_streak_${activity.currentLoginStreak}`);
      }
    } catch (gamiErr) {
      console.error('Failed to award login points:', gamiErr.message);
    }
  } catch (err) {
    console.error('Error in recordLogin:', err.message);
  }
};

// @desc    Get current user's raw activity details
// @route   GET /api/activity/me
// @access  Private
exports.getMyActivity = async (req, res) => {
  try {
    let activity = await UserActivity.findOne({ userId: req.user._id });
    if (!activity) {
      activity = await UserActivity.create({
        userId: req.user._id,
        role: req.user.role,
        lastActiveAt: new Date()
      });
    }
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user's aggregated activity summary
// @route   GET /api/activity/summary
// @access  Private
exports.getActivitySummary = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.user._id });
    if (!activity) {
      return res.json({
        success: true,
        data: {
          totalTimeSpentInSeconds: 0,
          totalLoginCount: 0,
          currentLoginStreak: 0,
          totalVideosWatched: 0,
          totalAssessmentsAttempted: 0,
          timeSpentThisWeek: 0,
          timeSpentThisMonth: 0
        }
      });
    }

    // Calculate time spent this week (last 7 days) and this month (last 30 days)
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);

    let timeSpentThisWeek = 0;
    let timeSpentThisMonth = 0;

    if (activity.dailyActiveTime && activity.dailyActiveTime.length > 0) {
      activity.dailyActiveTime.forEach(usage => {
        const usageDate = new Date(usage.date);
        if (usageDate >= oneWeekAgo) {
          timeSpentThisWeek += usage.seconds;
        }
        if (usageDate >= oneMonthAgo) {
          timeSpentThisMonth += usage.seconds;
        }
      });
    }

    res.json({
      success: true,
      data: {
        totalTimeSpentInSeconds: activity.totalTimeSpentInSeconds,
        totalLoginCount: activity.totalLoginCount,
        totalSessions: activity.totalSessions,
        currentLoginStreak: activity.currentLoginStreak,
        totalVideosWatched: activity.totalVideosWatched,
        totalAssessmentsAttempted: activity.totalAssessmentsAttempted,
        totalPagesVisited: activity.totalPagesVisited,
        timeSpentThisWeek,
        timeSpentThisMonth,
        lastLoginAt: activity.lastLoginAt,
        lastActiveAt: activity.lastActiveAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Post heartbeat to record page tracking, inactivity and video/assessment analytics
// @route   POST /api/activity/heartbeat
// @access  Private
exports.postHeartbeat = async (req, res) => {
  try {
    const { pageName, activeTime, isNewVisit, videoAnalytics, assessmentAnalytics } = req.body;
    
    // Validate inputs
    const seconds = Math.min(Math.max(parseInt(activeTime, 10) || 0, 0), 60); // Clamp value between 0 and 60 seconds

    let activity = await UserActivity.findOne({ userId: req.user._id });
    if (!activity) {
      activity = new UserActivity({
        userId: req.user._id,
        role: req.user.role,
        lastActiveAt: new Date(),
        currentSessionStart: new Date(),
        totalSessions: 1,
        totalLoginCount: 1
      });
    }

    // Update active state
    activity.lastActiveAt = new Date();
    activity.totalTimeSpentInSeconds += seconds;

    // Daily active time tracker
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyIdx = activity.dailyActiveTime.findIndex(d => d.date === todayStr);
    if (dailyIdx !== -1) {
      activity.dailyActiveTime[dailyIdx].seconds += seconds;
    } else {
      activity.dailyActiveTime.push({ date: todayStr, seconds });
    }

    // Page tracking
    if (pageName) {
      const pageIdx = activity.pagesVisited.findIndex(p => p.pageName.toLowerCase() === pageName.toLowerCase());
      if (pageIdx !== -1) {
        activity.pagesVisited[pageIdx].timeSpentOnPage += seconds;
        if (isNewVisit) {
          activity.pagesVisited[pageIdx].visitCount += 1;
          activity.totalPagesVisited += 1;
        }
      } else {
        activity.pagesVisited.push({
          pageName,
          visitCount: 1,
          timeSpentOnPage: seconds
        });
        activity.totalPagesVisited += 1;
      }
    }

    // Video analytics tracking
    if (videoAnalytics && videoAnalytics.videoId) {
      const vidIdx = activity.videosWatched.findIndex(v => v.videoId === videoAnalytics.videoId);
      if (vidIdx !== -1) {
        activity.videosWatched[vidIdx].watchTime += seconds;
        activity.videosWatched[vidIdx].completionPercentage = Math.min(
          100,
          Math.max(activity.videosWatched[vidIdx].completionPercentage, videoAnalytics.completionPercentage || 0)
        );
        activity.videosWatched[vidIdx].lastWatchedAt = new Date();
      } else {
        activity.videosWatched.push({
          videoId: videoAnalytics.videoId,
          title: videoAnalytics.title || '',
          watchTime: seconds,
          completionPercentage: Math.min(100, videoAnalytics.completionPercentage || 0),
          lastWatchedAt: new Date()
        });
      }
      activity.totalVideosWatched = activity.videosWatched.length;
    }

    // Assessment analytics tracking
    if (assessmentAnalytics && assessmentAnalytics.assessmentId) {
      const assIdx = activity.assessments.findIndex(a => a.assessmentId === assessmentAnalytics.assessmentId);
      const isPassedNow = assessmentAnalytics.passed || false;
      const scoreNow = assessmentAnalytics.score || 0;
      
      if (assIdx !== -1) {
        activity.assessments[assIdx].timeSpent += seconds;
        activity.assessments[assIdx].score = Math.max(activity.assessments[assIdx].score, scoreNow);
        if (isPassedNow) activity.assessments[assIdx].passed = true;
        activity.assessments[assIdx].attemptedAt = new Date();
      } else {
        activity.assessments.push({
          assessmentId: assessmentAnalytics.assessmentId,
          title: assessmentAnalytics.title || '',
          score: scoreNow,
          passed: isPassedNow,
          timeSpent: seconds,
          attemptedAt: new Date()
        });
      }

      // Re-aggregate assessments
      activity.totalAssessmentsAttempted = activity.assessments.length;
      activity.totalAssessmentsPassed = activity.assessments.filter(a => a.passed).length;
      activity.totalAssessmentTimeSpent = activity.assessments.reduce((sum, a) => sum + a.timeSpent, 0);
      const sumScores = activity.assessments.reduce((sum, a) => sum + a.score, 0);
      activity.averageAssessmentScore = Math.round(sumScores / activity.assessments.length);
    }

    await activity.save();

    // Trigger Gamification points
    try {
      const { awardPoints } = require('../services/gamificationService');
      
      // Video lecture completion points
      if (videoAnalytics && videoAnalytics.videoId && videoAnalytics.completionPercentage >= 90) {
        await awardPoints(req.user._id, 'video', videoAnalytics.videoId);
      }
      
      // Assessment passing points (includes score percentage checks)
      if (assessmentAnalytics && assessmentAnalytics.assessmentId && assessmentAnalytics.passed) {
        await awardPoints(req.user._id, 'assessment', assessmentAnalytics.assessmentId, assessmentAnalytics.score);
      }
    } catch (gamiErr) {
      console.error('Failed to award heartbeat points:', gamiErr.message);
    }

    res.json({ success: true, message: 'Heartbeat recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    End active login session
// @route   POST /api/activity/session/end
// @access  Private
exports.endSession = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.user._id });
    if (!activity || !activity.currentSessionStart) {
      return res.json({ success: true, message: 'No active session was running' });
    }

    const duration = Math.round((new Date() - activity.currentSessionStart) / 1000);
    if (duration > 0) {
      activity.totalTimeSpentInSeconds += duration;
      if (duration > activity.longestSessionDuration) {
        activity.longestSessionDuration = duration;
      }
    }

    activity.lastLogoutAt = new Date();
    activity.currentSessionStart = null;
    activity.lastActiveAt = new Date();

    await activity.save();
    res.json({ success: true, message: 'Session ended successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get users list with active metrics (For Admin User Table)
// @route   GET /api/admin/activity/users
// @access  Private/Admin
exports.getAdminUsersActivity = async (req, res) => {
  try {
    // Fetch all user activities, populate User data
    const activities = await UserActivity.find()
      .populate('userId', 'fullName email avatar role')
      .lean();

    const formattedData = activities.map(act => {
      // Find most visited page
      let mostVisitedPage = 'None';
      let maxVisits = 0;
      if (act.pagesVisited && act.pagesVisited.length > 0) {
        act.pagesVisited.forEach(p => {
          if (p.visitCount > maxVisits) {
            maxVisits = p.visitCount;
            mostVisitedPage = p.pageName;
          }
        });
      }

      return {
        _id: act._id,
        userId: act.userId?._id || '',
        fullName: act.userId?.fullName || 'Deleted User',
        email: act.userId?.email || '',
        role: act.userId?.role || act.role,
        avatar: act.userId?.avatar || '',
        totalLogins: act.totalLoginCount,
        lastLogin: act.lastLoginAt,
        lastActive: act.lastActiveAt,
        totalPlatformTime: act.totalTimeSpentInSeconds,
        avgSessionDuration: act.totalSessions > 0 ? Math.round(act.totalTimeSpentInSeconds / act.totalSessions) : 0,
        longestSessionDuration: act.longestSessionDuration,
        loginStreak: act.currentLoginStreak,
        videosWatched: act.totalVideosWatched,
        assessmentsAttempted: act.totalAssessmentsAttempted,
        mostVisitedPage
      };
    });

    res.json({ success: true, count: formattedData.length, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get detailed activity stats of a single user
// @route   GET /api/admin/activity/:userId
// @access  Private/Admin
exports.getAdminUserDetailActivity = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.params.userId })
      .populate('userId', 'fullName email avatar role profile');

    if (!activity) {
      return res.status(404).json({ success: false, message: 'User activity metrics not found' });
    }

    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Admin summary metrics and trends data for charts
// @route   GET /api/admin/activity/summary
// @access  Private/Admin
exports.getAdminSummary = async (req, res) => {
  try {
    const now = new Date();
    
    // Active User thresholds
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dauCount = await UserActivity.countDocuments({ lastActiveAt: { $gte: oneDayAgo } });
    const wauCount = await UserActivity.countDocuments({ lastActiveAt: { $gte: sevenDaysAgo } });
    const mauCount = await UserActivity.countDocuments({ lastActiveAt: { $gte: thirtyDaysAgo } });

    // Aggregates for avg session duration & total sessions today
    const todayStr = now.toISOString().split('T')[0];
    const totalSessionsToday = await UserActivity.countDocuments({ lastLoginDate: todayStr });

    const stats = await UserActivity.aggregate([
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$totalTimeSpentInSeconds' },
          totalSessionsSum: { $sum: '$totalSessions' }
        }
      }
    ]);

    const avgSessionTime = stats.length > 0 && stats[0].totalSessionsSum > 0
      ? Math.round(stats[0].totalTime / stats[0].totalSessionsSum)
      : 0;

    // Top 5 Most Active Students
    const topStudents = await UserActivity.find()
      .populate('userId', 'fullName email avatar')
      .sort({ totalTimeSpentInSeconds: -1 })
      .limit(5)
      .lean();

    const formattedStudents = topStudents.map(s => ({
      userId: s.userId?._id,
      fullName: s.userId?.fullName || 'Deleted User',
      email: s.userId?.email || '',
      avatar: s.userId?.avatar || '',
      totalTimeSpent: s.totalTimeSpentInSeconds,
      totalLogins: s.totalLoginCount
    }));

    // Charts Trends Data (Grouped by login date in the last 7 days)
    const trendsLast7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const loginsOnDay = await UserActivity.countDocuments({ lastLoginDate: dateStr });
      
      // Calculate active hours by summing seconds of activity on this day
      const usageStats = await UserActivity.aggregate([
        { $unwind: '$dailyActiveTime' },
        { $match: { 'dailyActiveTime.date': dateStr } },
        { $group: { _id: null, totalSeconds: { $sum: '$dailyActiveTime.seconds' } } }
      ]);
      const activeHours = usageStats.length > 0 ? parseFloat((usageStats[0].totalSeconds / 3600).toFixed(2)) : 0;

      trendsLast7Days.push({
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        logins: loginsOnDay,
        activeHours
      });
    }

    // Page Engagement breakdowns
    const pageEngagements = await UserActivity.aggregate([
      { $unwind: '$pagesVisited' },
      {
        $group: {
          _id: '$pagesVisited.pageName',
          totalVisits: { $sum: '$pagesVisited.visitCount' },
          totalSeconds: { $sum: '$pagesVisited.timeSpentOnPage' }
        }
      },
      { $sort: { totalVisits: -1 } }
    ]);

    const formattedPageEngagement = pageEngagements.map(p => ({
      pageName: p._id,
      visits: p.totalVisits,
      hoursSpent: parseFloat((p.totalSeconds / 3600).toFixed(2))
    }));

    // Peak Activity hours (rough approximation based on lastActiveAt hour distribution)
    const peakActivity = await UserActivity.aggregate([
      {
        $project: {
          hour: { $hour: '$lastActiveAt' }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const hours24 = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, activeUsers: 0 }));
    peakActivity.forEach(p => {
      if (p._id !== null && hours24[p._id]) {
        hours24[p._id].activeUsers = p.count;
      }
    });

    res.json({
      success: true,
      data: {
        dau: dauCount,
        wau: wauCount,
        mau: mauCount,
        avgSessionTime,
        totalSessionsToday,
        mostActiveStudents: formattedStudents,
        trends: trendsLast7Days,
        pageEngagement: formattedPageEngagement,
        peakHours: hours24
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
