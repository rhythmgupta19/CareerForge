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

    let phaseId = req.params.phaseId || req.query.phaseId || req.body.phaseId;
    let topicId = req.params.topicId || req.query.topicId || req.body.topicId || req.body.lastOpenedTopic;
    let assessmentId = req.params.assessmentId || req.query.assessmentId || req.body.assessmentId;
    let genericId = req.params.id;

    let phase;

    if (phaseId && phaseId.match(/^[0-9a-fA-F]{24}$/)) {
      phase = await Phase.findById(phaseId).populate('domainId');
    }

    if (!phase && topicId && topicId.match(/^[0-9a-fA-F]{24}$/)) {
      const topic = await Topic.findById(topicId).populate({
        path: 'phaseId',
        populate: { path: 'domainId' }
      });
      if (topic) {
        phase = topic.phaseId;
      }
    }

    if (!phase && assessmentId && assessmentId.match(/^[0-9a-fA-F]{24}$/)) {
      const Assessment = require('../models/Assessment');
      const assessment = await Assessment.findById(assessmentId).populate({
        path: 'phaseId',
        populate: { path: 'domainId' }
      });
      if (assessment) {
        phase = assessment.phaseId;
      }
    }

    if (!phase && genericId && genericId.match(/^[0-9a-fA-F]{24}$/)) {
      const topic = await Topic.findById(genericId).populate({
        path: 'phaseId',
        populate: { path: 'domainId' }
      });
      if (topic) {
        phase = topic.phaseId;
      } else {
        phase = await Phase.findById(genericId).populate('domainId');
        if (!phase) {
          const Assessment = require('../models/Assessment');
          const assessment = await Assessment.findById(genericId).populate({
            path: 'phaseId',
            populate: { path: 'domainId' }
          });
          if (assessment) {
            phase = assessment.phaseId;
          }
        }
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
        message: `Level ${phase.phaseNumber} is locked. You must complete previous levels to unlock it.`
      });
    }

    if (key === 'devops' && phase.phaseNumber > 0) {
      const UserAssessmentProgress = require('../models/UserAssessmentProgress');
      const Phase = require('../models/Phase');
      const Topic = require('../models/Topic');
      
      const prevPhases = await Phase.find({ domainId: domain._id, phaseNumber: { $lt: phase.phaseNumber } });
      const prevPhaseIds = prevPhases.map(p => p._id);
      const requiredTopics = await Topic.find({ phaseId: { $in: prevPhaseIds }, isActive: true });
      
      const passedAssessmentsCount = await UserAssessmentProgress.countDocuments({
        userId: req.user._id,
        moduleId: { $in: requiredTopics.map(t => t._id) },
        passed: true
      });
      
      if (passedAssessmentsCount < requiredTopics.length) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You must pass all mini assessments in previous levels before unlocking Level ${phase.phaseNumber}.`
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { protect, authorize, checkPhaseAccess };
