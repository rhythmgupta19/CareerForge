const mongoose = require('mongoose');

const terminalSessionSchema = new mongoose.Schema({
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
  currentDir: {
    type: String,
    default: '/home/student'
  },
  vfs: {
    type: Object,
    default: () => ({
      "home": {
        "type": "dir",
        "children": {
          "student": {
            "type": "dir",
            "children": {
              "welcome.txt": { "type": "file", "content": "Welcome to CareerForge DevOps Lab! Type 'help' to see available commands.\n" }
            }
          }
        }
      }
    })
  },
  git: {
    type: Object,
    default: () => ({
      initialized: false,
      currentBranch: 'main',
      branches: ['main'],
      staged: [],
      commits: []
    })
  },
  docker: {
    type: Object,
    default: () => ({
      images: ['ubuntu:latest', 'nginx:alpine', 'node:18-alpine'],
      containers: []
    })
  },
  k8s: {
    type: Object,
    default: () => ({
      pods: [],
      deployments: [],
      services: []
    })
  },
  history: [{
    type: String
  }],
  lastActive: {
    type: Date,
    default: Date.now
  }
});

terminalSessionSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TerminalSession', terminalSessionSchema);
