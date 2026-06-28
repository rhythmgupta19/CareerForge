const Leaderboard = require('../models/Leaderboard');
const PointsLog = require('../models/PointsLog');
const LeaderboardSettings = require('../models/LeaderboardSettings');
const User = require('../models/User');

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

// Helper to get or seed settings
async function getSettings() {
  let settings = await LeaderboardSettings.findOne();
  if (!settings) {
    settings = await LeaderboardSettings.create({
      pointSystem: {},
      badges: defaultBadges
    });
  }
  return settings;
}

// Award Points helper
exports.awardPoints = async (userId, activityType, referenceId, reqScore = null) => {
  try {
    const settings = await getSettings();
    const rules = settings.pointSystem;

    // Determine point weight based on activityType
    let points = 0;
    switch (activityType) {
      case 'login':
        points = rules.dailyLogin;
        break;
      case 'video':
        points = rules.completeVideo;
        break;
      case 'module':
        points = rules.completeModule;
        break;
      case 'assessment':
        points = rules.passAssessment;
        if (reqScore && reqScore >= 90) {
          points += rules.score90PlusBonus; // add 90%+ bonus points
        }
        break;
      case 'assignment':
        points = rules.submitAssignment;
        break;
      case 'coding':
        points = rules.solveCodingProblem;
        break;
      case 'streak':
        points = rules.dailyStreakBonus;
        break;
      case 'attendance':
        points = rules.perfectAttendance;
        break;
      default:
        points = 0;
    }

    if (points <= 0) return { success: false, reason: 'Invalid points rule' };

    // Prevent duplicate entries
    const existing = await PointsLog.findOne({ userId, activityType, referenceId });
    if (existing) {
      return { success: false, reason: 'Duplicate points claim' };
    }

    // Log the transaction
    await PointsLog.create({
      userId,
      activityType,
      referenceId,
      pointsAwarded: points
    });

    // Update Leaderboard Profile
    const user = await User.findById(userId);
    if (!user) return { success: false, reason: 'User not found' };

    let entry = await Leaderboard.findOne({ userId });
    if (!entry) {
      entry = new Leaderboard({
        userId,
        fullName: user.fullName,
        avatar: user.avatar || '',
        courseId: user.activeDomain || null,
        points: 0
      });
    }

    // Accumulate points
    entry.points += points;
    entry.weeklyPoints += points;
    entry.monthlyPoints += points;

    // Recalculate level
    // Level 1 : 0–100 points
    // Level 2 : 101–300 points
    // Level 3 : 301–600 points
    // Level 4 : 601–1000 points
    // Level 5 : 1001–1500 points
    // Level 6 : 1500+ points
    let currentLevel = 1;
    if (entry.points > 1500) currentLevel = 6;
    else if (entry.points > 1000) currentLevel = 5;
    else if (entry.points > 600) currentLevel = 4;
    else if (entry.points > 300) currentLevel = 3;
    else if (entry.points > 100) currentLevel = 2;

    const leveledUp = currentLevel > entry.level;
    entry.level = currentLevel;

    // Sync basic user activity metrics
    const UserActivity = require('../models/UserActivity');
    const activity = await UserActivity.findOne({ userId });
    if (activity) {
      entry.totalStudyTime = activity.totalTimeSpentInSeconds;
      entry.totalLoginCount = activity.totalLoginCount;
      entry.loginStreak = activity.currentLoginStreak;
      entry.videosCompleted = activity.totalVideosWatched;
      entry.assessmentsAttempted = activity.totalAssessmentsAttempted;
      entry.assessmentsPassed = activity.totalAssessmentsPassed;
      entry.averageAssessmentScore = activity.averageAssessmentScore;
      entry.assignmentsSubmitted = activity.totalAssignmentsSubmitted;
    }

    // Add coding problems solved
    const Submission = require('../models/Submission');
    const acceptedSubmissions = await Submission.distinct('problem', { user: userId, status: 'Accepted' });
    entry.codingProblemsSolved = acceptedSubmissions.length;

    // Evaluate Badges
    const earnedBadges = [...(entry.badges || [])];
    
    // First login
    if (entry.totalLoginCount >= 1 && !earnedBadges.includes('first_login')) {
      earnedBadges.push('first_login');
    }
    // 7 day streak
    if (entry.loginStreak >= 7 && !earnedBadges.includes('streak_7')) {
      earnedBadges.push('streak_7');
    }
    // 30 day streak
    if (entry.loginStreak >= 30 && !earnedBadges.includes('streak_30')) {
      earnedBadges.push('streak_30');
    }
    // 100 hours studied (360,000 seconds)
    if (entry.totalStudyTime >= 360000 && !earnedBadges.includes('study_100')) {
      earnedBadges.push('study_100');
    }
    // Coding champion (10 coding problems)
    if (entry.codingProblemsSolved >= 10 && !earnedBadges.includes('coding_champion')) {
      earnedBadges.push('coding_champion');
    }
    // Assessment master (5 assessments passed)
    if (entry.assessmentsPassed >= 5 && !earnedBadges.includes('assessment_master')) {
      earnedBadges.push('assessment_master');
    }
    // Perfect Attendance
    if (entry.totalLoginCount >= 50 && !earnedBadges.includes('perfect_attendance')) {
      earnedBadges.push('perfect_attendance');
    }
    // Video master
    if (entry.videosCompleted >= 10 && !earnedBadges.includes('video_master')) {
      earnedBadges.push('video_master');
    }

    entry.badges = earnedBadges;
    entry.lastUpdatedAt = new Date();
    await entry.save();

    // Trigger rankings recalculations asynchronously
    exports.recalculateRankings();

    return { 
      success: true, 
      points, 
      leveledUp, 
      level: currentLevel,
      badgesEarned: earnedBadges.length > (entry.badges?.length || 0)
    };
  } catch (err) {
    console.error('Error in awardPoints service:', err.message);
    return { success: false, error: err.message };
  }
};

// Recalculate Rankings Pipeline
exports.recalculateRankings = async () => {
  try {
    // 1. Calculate and update Global Rank
    // Ranking Priority: Points (desc), averageAssessmentScore (desc), totalStudyTime (desc), codingProblemsSolved (desc), loginStreak (desc)
    const allUsers = await Leaderboard.find()
      .sort({ 
        points: -1, 
        averageAssessmentScore: -1, 
        totalStudyTime: -1, 
        codingProblemsSolved: -1, 
        loginStreak: -1 
      });

    const bulkGlobalOps = allUsers.map((user, idx) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { rank: idx + 1 } }
      }
    }));
    if (bulkGlobalOps.length > 0) {
      await Leaderboard.bulkWrite(bulkGlobalOps);
    }

    // 2. Calculate and update Weekly Rank
    const weeklyUsers = await Leaderboard.find()
      .sort({ 
        weeklyPoints: -1, 
        averageAssessmentScore: -1, 
        totalStudyTime: -1, 
        codingProblemsSolved: -1 
      });
    const bulkWeeklyOps = weeklyUsers.map((user, idx) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { weeklyRank: idx + 1 } }
      }
    }));
    if (bulkWeeklyOps.length > 0) {
      await Leaderboard.bulkWrite(bulkWeeklyOps);
    }

    // 3. Calculate and update Monthly Rank
    const monthlyUsers = await Leaderboard.find()
      .sort({ 
        monthlyPoints: -1, 
        averageAssessmentScore: -1, 
        totalStudyTime: -1, 
        codingProblemsSolved: -1 
      });
    const bulkMonthlyOps = monthlyUsers.map((user, idx) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { monthlyRank: idx + 1 } }
      }
    }));
    if (bulkMonthlyOps.length > 0) {
      await Leaderboard.bulkWrite(bulkMonthlyOps);
    }

    console.log('✅ Leaderboard rankings recalculated successfully!');
  } catch (err) {
    console.error('Error recalculating rankings:', err.message);
  }
};
