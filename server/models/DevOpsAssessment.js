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
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, unique: true },
  title: { type: String, required: true, trim: true },
  questions: {
    type: [questionSchema],
    validate: [arrayLimit, '{PATH} must contain exactly 10 questions']
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 10;
}

module.exports = mongoose.model('DevOpsAssessment', devOpsAssessmentSchema);
