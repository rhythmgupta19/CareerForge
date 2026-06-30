const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: [{ type: String, required: true, trim: true }],
  correctAnswer: { type: String, required: true, trim: true },
  explanation: { type: String, required: true, trim: true }
}, { _id: false });

const devOpsAssessmentSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: false },
  assignmentType: { 
    type: String, 
    enum: ['level', 'topic', 'video', 'course'], 
    default: 'topic' 
  },
  title: { type: String, required: true, trim: true },
  passingPercentage: { type: Number, default: 70 },
  maxAttempts: { type: Number, default: 3 },
  timeLimitMinutes: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  questions: {
    type: [questionSchema],
    validate: [arrayLimit, '{PATH} must contain between 1 and 20 questions']
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length >= 1 && val.length <= 20;
}

// Compound unique index ensuring one assessment per target assignment
devOpsAssessmentSchema.index({ roadmapId: 1, levelId: 1, moduleId: 1, assignmentType: 1 }, { unique: true });

module.exports = mongoose.model('DevOpsAssessment', devOpsAssessmentSchema);
