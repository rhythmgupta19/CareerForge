const mongoose = require('mongoose');

const userAssessmentProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  attempts: { type: Number, default: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

// Ensure unique combination of user and module
userAssessmentProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('UserAssessmentProgress', userAssessmentProgressSchema);
