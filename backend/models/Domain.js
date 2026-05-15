import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String },
  duration: { type: String },
  prerequisites: [String],
  careerRoles: [String],
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }]
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);
export default Domain;
