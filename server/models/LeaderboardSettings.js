const mongoose = require('mongoose');

const pointRulesSchema = new mongoose.Schema({
  dailyLogin: { type: Number, default: 5 },
  completeVideo: { type: Number, default: 10 },
  completeModule: { type: Number, default: 25 },
  passAssessment: { type: Number, default: 30 },
  score90PlusBonus: { type: Number, default: 50 },
  submitAssignment: { type: Number, default: 20 },
  solveCodingProblem: { type: Number, default: 15 },
  dailyStreakBonus: { type: Number, default: 10 },
  perfectAttendance: { type: Number, default: 50 }
}, { _id: false });

const badgeConfigSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. 'first_login'
  name: { type: String, required: true },
  icon: { type: String, default: '🏅' },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const leaderboardSettingsSchema = new mongoose.Schema(
  {
    pointSystem: { type: pointRulesSchema, default: () => ({}) },
    badges: { type: [badgeConfigSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaderboardSettings', leaderboardSettingsSchema);
