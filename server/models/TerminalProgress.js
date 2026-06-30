const mongoose = require('mongoose');

const terminalProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  commandsExecutedCount: {
    type: Number,
    default: 0
  },
  practiceTimeSeconds: {
    type: Number,
    default: 0
  },
  completedLabs: [{
    type: String // List of labIds completed
  }],
  lastActiveSession: {
    type: Date,
    default: Date.now
  }
});

terminalProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TerminalProgress', terminalProgressSchema);
