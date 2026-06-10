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
      const key = 'devops';
      
      const domainProgress = getSafeDomainProgress(user, key);
      const alreadyCompleted = domainProgress.completedTopics.some(ct => ct.topicId.toString() === moduleId.toString());
      
      if (!alreadyCompleted) {
        domainProgress.completedTopics.push({
          topicId: moduleId,
          completedAt: new Date(),
          studyTimeMinutes: 30,
          notes: 'Passed the DevOps MCQ mini assessment!',
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
    const { roadmapId, levelId, moduleId, title, questions } = req.body;
    if (!roadmapId || !levelId || !moduleId || !title || !questions) {
      return res.status(400).json({ success: false, message: 'All assessment fields are required.' });
    }
    if (questions.length !== 10) {
      return res.status(400).json({ success: false, message: 'Assessment must contain exactly 10 questions.' });
    }

    let assessment = await DevOpsAssessment.findOne({ moduleId });
    if (assessment) {
      assessment.title = title;
      assessment.roadmapId = roadmapId;
      assessment.levelId = levelId;
      assessment.questions = questions;
      await assessment.save();
    } else {
      assessment = await DevOpsAssessment.create({
        roadmapId,
        levelId,
        moduleId,
        title,
        questions
      });
    }

    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete an entire assessment
// @route   DELETE /api/assessments/admin/:moduleId
exports.deleteAssessmentAdmin = async (req, res) => {
  try {
    const { moduleId } = req.params;
    await DevOpsAssessment.findOneAndDelete({ moduleId });
    res.json({ success: true, message: 'DevOps Assessment deleted successfully.' });
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
