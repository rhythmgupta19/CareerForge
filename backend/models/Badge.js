import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  unlockCondition: { type: String },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }
}, { timestamps: true });

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
