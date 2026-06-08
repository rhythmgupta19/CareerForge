const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

const checkPhaseAccess = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }
    const Phase = require('../models/Phase');
    const Topic = require('../models/Topic');
    const Domain = require('../models/Domain');

    let phaseId = req.params.phaseId || req.query.phaseId;
    let topicId = req.params.id || req.params.topicId || req.query.topicId;

    let phase;
    if (phaseId) {
      if (phaseId.match(/^[0-9a-fA-F]{24}$/)) {
        phase = await Phase.findById(phaseId).populate('domainId');
      }
    } else if (topicId) {
      if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
        const topic = await Topic.findById(topicId).populate({
          path: 'phaseId',
          populate: { path: 'domainId' }
        });
        if (topic) {
          phase = topic.phaseId;
        }
      }
    } else if (req.params.id) {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        phase = await Phase.findById(req.params.id).populate('domainId');
      }
    }

    if (!phase) {
      return next();
    }

    const domain = phase.domainId;
    if (!domain) {
      return next();
    }

    const getProgressKey = (slug) => {
      if (!slug) return 'dsa';
      const lowercaseSlug = slug.toLowerCase();
      if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
      if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
      if (lowercaseSlug === 'devops') return 'devops';
      if (lowercaseSlug === 'dsa') return 'dsa';
      if (lowercaseSlug.includes('web') || lowercaseSlug.includes('ui-ux')) return 'webdev';
      if (lowercaseSlug.includes('open') || lowercaseSlug.includes('git')) return 'opensource';
      if (lowercaseSlug.includes('dsa') || lowercaseSlug.includes('data')) return 'dsa';
      return 'devops';
    };

    const key = getProgressKey(domain.slug);
    const userProgress = req.user.domainsProgress?.[key] || { currentPhase: 0 };
    
    if (phase.phaseNumber > userProgress.currentPhase) {
      return res.status(403).json({
        success: false,
        message: `Level ${phase.phaseNumber} is locked. You must complete previous levels and pass their assessments to unlock it.`
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { protect, authorize, checkPhaseAccess };
