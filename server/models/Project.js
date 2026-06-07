const mongoose = require('mongoose');

const projectStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  guidance: { type: String, required: true }
}, { _id: false });

const projectRoadmapPhaseSchema = new mongoose.Schema({
  phaseName: { type: String, required: true },
  tasks: [{ type: String }]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String, // 'webdev', 'dsa', 'devops', 'opensource'
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  steps: [projectStepSchema],
  roadmap: [projectRoadmapPhaseSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
