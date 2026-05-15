import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  email: String,
  collegeName: String,
  branch: String,
  year: String,
  semester: String,
  programmingLanguages: [String],
  tools: [String],
  skillLevel: String,
  careerInterest: String,
  goal: String,
  dailyStudyTime: Number,
  targetCompletionTime: Number
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
