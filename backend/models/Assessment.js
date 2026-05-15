import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['external', 'custom', 'certification'], required: true },
  platform: { type: String },
  assessmentLink: { type: String },
  hackerRankCertificationLink: { type: String },
  passingScore: { type: Number },
  difficultyRating: { type: String },
  maxAttempts: { type: Number, default: 3 },
  unlocksNextPhase: { type: Boolean, default: true },
  adminEditable: { type: Boolean, default: true }
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
