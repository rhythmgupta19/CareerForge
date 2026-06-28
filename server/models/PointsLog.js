const mongoose = require('mongoose');

const pointsLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true }, // 'login', 'video', 'module', 'assessment', 'coding', etc.
  referenceId: { type: String, required: true }, // e.g. TopicId, DateStr
  pointsAwarded: { type: Number, required: true },
  awardedAt: { type: Date, default: Date.now }
});

// Compound unique index to guarantee no double points
pointsLogSchema.index({ userId: 1, activityType: 1, referenceId: 1 }, { unique: true });

module.exports = mongoose.model('PointsLog', pointsLogSchema);
