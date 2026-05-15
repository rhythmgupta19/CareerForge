import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }
}, { timestamps: true });

const Phase = mongoose.model('Phase', phaseSchema);
export default Phase;
