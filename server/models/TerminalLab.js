const mongoose = require('mongoose');

const terminalLabSchema = new mongoose.Schema({
  labId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['linux', 'git', 'docker', 'k8s'],
    required: true
  },
  objectives: [{
    type: String
  }],
  initialVfs: {
    type: Object
  },
  validationRules: [{
    type: {
      type: String,
      enum: ['file_exists', 'dir_exists', 'file_contains', 'git_initialized', 'git_committed', 'docker_running', 'k8s_applied'],
      required: true
    },
    path: String,          // for files/dirs (e.g. '/home/student/app.js')
    content: String,       // content to match for file_contains
    imageName: String,     // docker container image name to match
    resourceName: String   // k8s pod/deployment resource name to match
  }],
  xpReward: {
    type: Number,
    default: 25
  }
});

module.exports = mongoose.model('TerminalLab', terminalLabSchema);
