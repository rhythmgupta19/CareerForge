const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    default: 'Remote'
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  },
  description: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  },
  domain: {
    type: String, // 'webdev', 'dsa', 'devops', 'opensource'
    required: true,
    index: true
  },
  requirements: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
