import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'mentor'], default: 'student' },
  profile: {
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
    targetCompletionTime: Number,
    selectedDomainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' }
  },
  progress: {
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    passedAssessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    studyMinutes: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 }
  }
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
