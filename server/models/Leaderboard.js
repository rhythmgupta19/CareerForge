const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  avatar: { type: String, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  batchId: { type: String, default: 'Default Batch' },
  points: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  
  // Ranks
  rank: { type: Number, default: 0 },
  weeklyRank: { type: Number, default: 0 },
  monthlyRank: { type: Number, default: 0 },

  // Stats
  totalStudyTime: { type: Number, default: 0 },
  totalLoginCount: { type: Number, default: 0 },
  loginStreak: { type: Number, default: 0 },
  videosCompleted: { type: Number, default: 0 },
  assessmentsAttempted: { type: Number, default: 0 },
  assessmentsPassed: { type: Number, default: 0 },
  averageAssessmentScore: { type: Number, default: 0 },
  assignmentsSubmitted: { type: Number, default: 0 },
  codingProblemsSolved: { type: Number, default: 0 },
  badges: [{ type: String }],
  level: { type: Number, default: 1 },
  lastUpdatedAt: { type: Date, default: Date.now }
});

// Indexes for high speed rank operations
leaderboardSchema.index({ points: -1, averageAssessmentScore: -1 });
leaderboardSchema.index({ weeklyPoints: -1 });
leaderboardSchema.index({ monthlyPoints: -1 });
leaderboardSchema.index({ courseId: 1, points: -1 });
leaderboardSchema.index({ batchId: 1, points: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
