const mongoose = require('mongoose');
const DevOpsAssessment = require('../models/DevOpsAssessment');
const UserAssessmentProgress = require('../models/UserAssessmentProgress');
const Topic = require('../models/Topic');
const User = require('../models/User');
const { getSafeDomainProgress, checkAndAdvancePhase } = require('./progressController');

// Helper to resolve progress key
const getProgressKey = (slug) => {
  if (!slug) return 'dsa';
  const lowercaseSlug = slug.toLowerCase();
  if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
  if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
  if (lowercaseSlug === 'devops') return 'devops';
  if (lowercaseSlug === 'dsa') return 'dsa';
  return 'devops';
};

// @desc    Get assessment by topic/module (Sanitized: NO correct answers or explanations)
// @route   GET /api/assessments/module/:moduleId
exports.getAssessmentByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    if (!moduleId || !moduleId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid module/topic ID.' });
    }

    const assessment = await DevOpsAssessment.findOne({ moduleId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'No assessment found for this topic.' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const questionsData = isAdmin 
      ? assessment.questions 
      : assessment.questions.map((q, idx) => ({
          index: idx,
          question: q.question,
          options: q.options
        }));

    const userProgress = await UserAssessmentProgress.findOne({ userId: req.user._id, moduleId });
    const isPassed = userProgress ? userProgress.passed : false;
    const score = userProgress ? userProgress.score : null;
    const attempts = userProgress ? userProgress.attempts : 0;

    res.json({
      success: true,
      data: {
        _id: assessment._id,
        title: assessment.title,
        questions: questionsData,
        isPassed,
        score,
        attempts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit DevOps assessment responses & Grade them
// @route   POST /api/assessments/submit
exports.submitAssessment = async (req, res) => {
  try {
    const { moduleId, answers } = req.body;
    if (!moduleId || !answers) {
      return res.status(400).json({ success: false, message: 'Module ID and answers are required.' });
    }

    const assessment = await DevOpsAssessment.findOne({ moduleId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    let correctCount = 0;
    const gradingResults = assessment.questions.map((q, idx) => {
      // support both array structure or object structure of answers
      const userAnswer = Array.isArray(answers) ? answers[idx] : answers[idx.toString()] || answers[idx];
      const isCorrect = userAnswer && userAnswer.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionIndex: idx,
        question: q.question,
        userAnswer: userAnswer || '',
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const totalQuestions = assessment.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70; // passing criteria >= 70%

    // 1. Update/Save UserAssessmentProgress
    let progress = await UserAssessmentProgress.findOne({ userId: req.user._id, moduleId });
    if (!progress) {
      progress = new UserAssessmentProgress({
        userId: req.user._id,
        roadmapId: assessment.roadmapId,
        levelId: assessment.levelId,
        moduleId,
        score,
        passed,
        attempts: 1,
        completedAt: passed ? new Date() : null
      });
    } else {
      progress.attempts += 1;
      if (!progress.passed || score > progress.score) {
        progress.score = score;
        progress.passed = passed || progress.passed;
      }
      if (passed && !progress.completedAt) {
        progress.completedAt = new Date();
      }
    }
    await progress.save();

    // 2. If user passed, update their roadmap completedTopics & XP
    if (passed) {
      const user = await User.findById(req.user._id);
      const Domain = require('../models/Domain');
      const domain = await Domain.findById(assessment.roadmapId);
      const key = getProgressKey(domain?.slug);
      
      const domainProgress = getSafeDomainProgress(user, key);
      const alreadyCompleted = domainProgress.completedTopics.some(ct => ct.topicId.toString() === moduleId.toString());
      
      if (!alreadyCompleted) {
        domainProgress.completedTopics.push({
          topicId: moduleId,
          completedAt: new Date(),
          studyTimeMinutes: 30,
          notes: `Passed the ${domain?.name || 'DevOps'} MCQ mini assessment!`,
          confidenceLevel: 5,
          revisionNeeded: false
        });

        // Award XP
        domainProgress.xp = (domainProgress.xp || 0) + 100;

        // Update overallProgress
        const totalTopicsInDomain = await Topic.countDocuments({ domainId: assessment.roadmapId, isActive: true });
        const completedTopicsInDomain = await Topic.countDocuments({
          _id: { $in: domainProgress.completedTopics.map(t => t.topicId) },
          domainId: assessment.roadmapId,
          isActive: true
        });
        domainProgress.overallProgress = totalTopicsInDomain > 0 ? Math.round((completedTopicsInDomain / totalTopicsInDomain) * 100) : 0;

        // Run auto-advance phase checks
        await checkAndAdvancePhase(user, assessment.roadmapId, key);

        user.markModified(`domainsProgress.${key}`);
        await user.save();
      }
    }

    res.json({
      success: true,
      data: {
        score,
        passed,
        correctAnswers: gradingResults.filter(r => r.isCorrect).map(r => r.questionIndex),
        incorrectAnswers: gradingResults.filter(r => !r.isCorrect).map(r => r.questionIndex),
        explanations: gradingResults.reduce((acc, r) => {
          acc[r.questionIndex] = {
            question: r.question,
            correctAnswer: r.correctAnswer,
            isCorrect: r.isCorrect,
            explanation: r.explanation
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN DASHBOARD ENDPOINTS ───

// @desc    Admin: Create or fully update an assessment
// @route   POST /api/assessments/admin/save
exports.saveAssessmentAdmin = async (req, res) => {
  try {
    const { 
      assessmentId, 
      roadmapId, 
      levelId, 
      moduleId, 
      assignmentType, 
      title, 
      questions,
      passingPercentage,
      maxAttempts,
      timeLimitMinutes,
      isPublished,
      order
    } = req.body;

    if (!roadmapId || !levelId || !title || !questions) {
      return res.status(400).json({ success: false, message: 'roadmapId, levelId, title, and questions are required.' });
    }

    if (questions.length < 1 || questions.length > 20) {
      return res.status(400).json({ success: false, message: 'Assessment must contain between 1 and 20 questions.' });
    }

    let assessment;
    if (assessmentId) {
      assessment = await DevOpsAssessment.findById(assessmentId);
    } else {
      // Find existing by assignment combination
      assessment = await DevOpsAssessment.findOne({
        roadmapId,
        levelId,
        moduleId: moduleId || null,
        assignmentType: assignmentType || 'topic'
      });
    }

    const updateFields = {
      roadmapId,
      levelId,
      moduleId: moduleId || null,
      assignmentType: assignmentType || 'topic',
      title,
      questions,
      passingPercentage: passingPercentage !== undefined ? passingPercentage : 70,
      maxAttempts: maxAttempts !== undefined ? maxAttempts : 3,
      timeLimitMinutes: timeLimitMinutes !== undefined ? timeLimitMinutes : 0,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: order !== undefined ? order : 0
    };

    if (assessment) {
      Object.assign(assessment, updateFields);
      await assessment.save();
    } else {
      assessment = await DevOpsAssessment.create(updateFields);
    }

    res.json({ success: true, message: 'Assessment saved successfully.', data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete an entire assessment
// @route   DELETE /api/assessments/admin/:id
exports.deleteAssessmentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await DevOpsAssessment.findByIdAndDelete(id);
    if (!result) {
      result = await DevOpsAssessment.findOneAndDelete({ moduleId: id });
    }
    if (!result) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }
    res.json({ success: true, message: 'DevOps Assessment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all assessments populated with Domain, Phase, Topic
// @route   GET /api/assessments/admin/all
exports.getAllAssessmentsAdmin = async (req, res) => {
  try {
    const assessments = await DevOpsAssessment.find({})
      .populate('roadmapId', 'name slug')
      .populate('levelId', 'name phaseNumber')
      .populate('moduleId', 'title order')
      .sort({ order: 1, createdAt: -1 });
      
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Reorder assessments
// @route   POST /api/assessments/admin/reorder
exports.reorderAssessmentsAdmin = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'orders array is required.' });
    }
    
    for (let item of orders) {
      await DevOpsAssessment.findByIdAndUpdate(item.id, { order: item.order });
    }
    
    res.json({ success: true, message: 'Assessments reordered successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get statistics for a specific assessment
// @route   GET /api/assessments/admin/stats/:moduleId
exports.getAssessmentStats = async (req, res) => {
  try {
    const { moduleId } = req.params;
    if (!moduleId || !moduleId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid module/topic ID.' });
    }

    const totalAttemptsObj = await UserAssessmentProgress.aggregate([
      { $match: { moduleId: new mongoose.Types.ObjectId(moduleId) } },
      { $group: {
          _id: null,
          totalAttempts: { $sum: "$attempts" },
          uniqueUsers: { $sum: 1 },
          passedUsers: { $sum: { $cond: ["$passed", 1, 0] } },
          avgScore: { $avg: "$score" }
        }
      }
    ]);

    const stats = totalAttemptsObj[0] || {
      totalAttempts: 0,
      uniqueUsers: 0,
      passedUsers: 0,
      avgScore: 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all user scores for an assessment
// @route   GET /api/assessments/admin/scores/:moduleId
exports.getAssessmentScores = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const progressRecords = await UserAssessmentProgress.find({ moduleId })
      .populate('userId', 'fullName email')
      .sort('-updatedAt');
      
    res.json({ success: true, data: progressRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assessment for a specific level (phase)
// @route   GET /api/assessments/level/:levelId
exports.getLevelAssessment = async (req, res) => {
  try {
    const { levelId } = req.params;
    
    // Find a DevOps assessment for the level (phase) with no moduleId (meaning it is level-level)
    const assessment = await DevOpsAssessment.findOne({ 
      levelId, 
      $or: [
        { moduleId: null },
        { moduleId: { $exists: false } }
      ]
    });
    
    if (!assessment) {
      return res.json({ success: true, data: null });
    }

    const userProgress = await UserAssessmentProgress.findOne({
      userId: req.user._id,
      levelId,
      moduleId: null
    });

    // Sanitize questions to hide correctAnswer
    const sanitizedQuestions = assessment.questions.map(q => ({
      question: q.question,
      options: q.options
    }));

    res.json({
      success: true,
      data: {
        _id: assessment._id,
        title: assessment.title,
        questions: sanitizedQuestions,
        userProgress: userProgress ? {
          score: userProgress.score,
          passed: userProgress.passed,
          attempts: userProgress.attempts,
          completedAt: userProgress.completedAt
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answers for level-level assessment
// @route   POST /api/assessments/level/submit
exports.submitLevelAssessment = async (req, res) => {
  try {
    const { levelId, answers } = req.body;
    if (!levelId || !answers) {
      return res.status(400).json({ success: false, message: 'levelId and answers are required.' });
    }

    const assessment = await DevOpsAssessment.findOne({ 
      levelId,
      $or: [
        { moduleId: null },
        { moduleId: { $exists: false } }
      ]
    });
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'No level assessment found.' });
    }

    // Grade
    let correctCount = 0;
    const gradingResults = [];

    assessment.questions.forEach((q, idx) => {
      const userAnswer = Array.isArray(answers) ? answers[idx] : answers[idx.toString()] || answers[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      gradingResults.push({
        questionIndex: idx,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const score = Math.round((correctCount / assessment.questions.length) * 100);
    const passed = score >= 70; // 70% passing threshold

    // Save progress in UserAssessmentProgress
    let progress = await UserAssessmentProgress.findOne({
      userId: req.user._id,
      levelId,
      moduleId: null
    });

    if (progress) {
      progress.score = Math.max(progress.score, score);
      progress.passed = progress.passed || passed;
      progress.attempts += 1;
      progress.completedAt = new Date();
      await progress.save();
    } else {
      progress = await UserAssessmentProgress.create({
        userId: req.user._id,
        roadmapId: assessment.roadmapId,
        levelId,
        moduleId: null,
        score,
        passed,
        attempts: 1,
        completedAt: new Date()
      });
    }

    // If passed, auto-advance phase using checkAndAdvancePhase helper
    if (passed) {
      const User = require('../models/User');
      const Domain = require('../models/Domain');
      const { checkAndAdvancePhase } = require('./progressController');
      const user = await User.findById(req.user._id);
      
      const domain = await Domain.findById(assessment.roadmapId);
      const key = getProgressKey(domain?.slug);
      await checkAndAdvancePhase(user, assessment.roadmapId, key);
      
      user.markModified(`domainsProgress.${key}`);
      await user.save();
    }

    res.json({
      success: true,
      data: {
        score,
        passed,
        explanations: gradingResults.reduce((acc, r) => {
          acc[r.questionIndex] = {
            question: r.question,
            correctAnswer: r.correctAnswer,
            isCorrect: r.isCorrect,
            explanation: r.explanation
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auto-complete level when no level assessment is configured
// @route   POST /api/assessments/level/complete-without-assessment
exports.completeLevelWithoutAssessment = async (req, res) => {
  try {
    const { levelId } = req.body;
    if (!levelId) {
      return res.status(400).json({ success: false, message: 'levelId is required.' });
    }

    const Phase = require('../models/Phase');
    const phase = await Phase.findById(levelId);
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Level/Phase not found.' });
    }

    // Verify no assessment exists for this level
    const assessmentExists = await DevOpsAssessment.exists({
      levelId,
      $or: [
        { moduleId: null },
        { moduleId: { $exists: false } }
      ]
    });

    const Assessment = require('../models/Assessment');
    const externalAssessmentExists = await Assessment.exists({ phaseId: levelId, isActive: true });

    if (assessmentExists || externalAssessmentExists) {
      return res.status(400).json({ success: false, message: 'Assessment exists for this level. You must attempt it.' });
    }

    // Advance phase directly
    const User = require('../models/User');
    const Topic = require('../models/Topic');
    const Domain = require('../models/Domain');
    const { checkAndAdvancePhase } = require('./progressController');
    const user = await User.findById(req.user._id);
    const domainObj = await Domain.findById(phase.domainId);
    const key = getProgressKey(domainObj?.slug);

    const topicsInPhase = await Topic.find({ phaseId: levelId, isActive: true });
    const domainProgress = user.domainsProgress[key];
    
    if (domainProgress) {
      const completedInPhase = domainProgress.completedTopics.filter(ct => 
        topicsInPhase.some(tp => tp._id.toString() === ct.topicId.toString())
      );

      if (completedInPhase.length < topicsInPhase.length) {
        return res.status(400).json({ success: false, message: 'You must complete all topics in this level before unlocking the next one.' });
      }

      await checkAndAdvancePhase(user, phase.domainId, key);

      // Force unlock if not already advanced
      if (domainProgress.currentPhase === phase.phaseNumber) {
        domainProgress.currentPhase = phase.phaseNumber + 1;
        domainProgress.xp = (domainProgress.xp || 0) + 500;
      }

      user.markModified(`domainsProgress.${key}`);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Level completed successfully. Next level unlocked!',
      currentPhase: user.domainsProgress[key]?.currentPhase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

