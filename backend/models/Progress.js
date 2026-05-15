import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  startedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  studyMinutes: { type: Number, default: 0 },
  dailyStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  activeDays: [String] // YYYY-MM-DD
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
