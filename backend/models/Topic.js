import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String },
  estimatedTime: { type: String },
  order: { type: Number },
  theoryLink: { type: String },
  gfgLink: { type: String },
  youtubeLink: { type: String },
  documentationLink: { type: String },
  practiceLink: { type: String },
  isRequired: { type: Boolean, default: true }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
