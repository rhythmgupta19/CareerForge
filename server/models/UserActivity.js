const mongoose = require('mongoose');

const pageVisitSchema = new mongoose.Schema({
  pageName: { type: String, required: true },
  visitCount: { type: Number, default: 0 },
  timeSpentOnPage: { type: Number, default: 0 } // in seconds
}, { _id: false });

const videoWatchSchema = new mongoose.Schema({
  videoId: { type: String, required: true }, // TopicId or YouTube Video ID
  title: { type: String, default: '' },
  watchTime: { type: Number, default: 0 }, // in seconds
  completionPercentage: { type: Number, default: 0 },
  lastWatchedAt: { type: Date, default: Date.now }
}, { _id: false });

const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true }, // TopicId or AssessmentId
  title: { type: String, default: '' },
  score: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 }, // in seconds
  attemptedAt: { type: Date, default: Date.now }
}, { _id: false });

const dailyUsageSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  seconds: { type: Number, default: 0 }
}, { _id: false });

const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, enum: ['student', 'admin', 'mentor'], default: 'student' },
    
    // Login & Session Stats
    totalLoginCount: { type: Number, default: 0 },
    totalTimeSpentInSeconds: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    currentSessionStart: { type: Date },
    lastLoginAt: { type: Date },
    lastLogoutAt: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },
    longestSessionDuration: { type: Number, default: 0 }, // in seconds
    currentLoginStreak: { type: Number, default: 0 },
    lastLoginDate: { type: String }, // YYYY-MM-DD
    
    // Total Engagement Counters
    totalVideosWatched: { type: Number, default: 0 },
    totalAssessmentsAttempted: { type: Number, default: 0 },
    totalAssignmentsSubmitted: { type: Number, default: 0 },
    totalPagesVisited: { type: Number, default: 0 },
    
    // Environment Info
    deviceInfo: { type: String, default: 'unknown' },
    browserInfo: { type: String, default: 'unknown' },
    ipAddress: { type: String, default: '' },

    // Detailed Engagement Subdocuments
    pagesVisited: [pageVisitSchema],
    videosWatched: [videoWatchSchema],
    assessments: [assessmentAttemptSchema],
    dailyActiveTime: [dailyUsageSchema],

    // Assessment aggregates
    totalAssessmentsPassed: { type: Number, default: 0 },
    totalAssessmentTimeSpent: { type: Number, default: 0 }, // in seconds
    averageAssessmentScore: { type: Number, default: 0 } // overall average score
  },
  { timestamps: true }
);

// Indexes for high performance querying
userActivitySchema.index({ userId: 1 }, { unique: true });
userActivitySchema.index({ lastActiveAt: -1 });
userActivitySchema.index({ role: 1 });
userActivitySchema.index({ lastLoginDate: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
