const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('activeDomain');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assigned students (mentor)
exports.getAssignedStudents = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id);
    const students = await User.find({ assignedMentor: req.user._id })
      .select('-password')
      .populate('activeDomain');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send feedback (mentor)
exports.sendFeedback = async (req, res) => {
  try {
    const { studentId, message, type } = req.body;
    const feedback = await Feedback.create({
      mentorId: req.user._id,
      studentId,
      message,
      type: type || 'feedback'
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get feedback for student
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.user._id })
      .populate('mentorId', 'fullName email')
      .sort('-createdAt');
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const Domain = require('../models/Domain');
    const totalDomains = await Domain.countDocuments();
    const Assessment = require('../models/Assessment');
    const totalAssessments = await Assessment.countDocuments();
    const Problem = require('../models/Problem');
    const Submission = require('../models/Submission');
    const totalProblems = await Problem.countDocuments();
    const publishedProblems = await Problem.countDocuments({ isPublished: true });
    const totalSubmissions = await Submission.countDocuments();

    // Helper to resolve progress keys
    const getProgressKey = (slug) => {
      if (!slug) return 'dsa';
      const lowercaseSlug = slug.toLowerCase();
      if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
      if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
      if (lowercaseSlug === 'devops') return 'devops';
      if (lowercaseSlug === 'dsa') return 'dsa';
      return 'dsa';
    };

    const allUsers = await User.find({ role: 'student' }).populate('activeDomain');
    const studentsOnLevel = {};
    const roadmapCompletion = {};
    const roadmapCounts = {};

    allUsers.forEach(u => {
      if (u.activeDomain) {
        const key = getProgressKey(u.activeDomain.slug);
        const progressObj = u.domainsProgress?.[key] || {};
        const phase = progressObj.currentPhase || 0;
        const progressVal = progressObj.overallProgress || 0;

        if (!studentsOnLevel[key]) studentsOnLevel[key] = {};
        studentsOnLevel[key][phase] = (studentsOnLevel[key][phase] || 0) + 1;

        if (!roadmapCompletion[key]) {
          roadmapCompletion[key] = 0;
          roadmapCounts[key] = 0;
        }
        roadmapCompletion[key] += progressVal;
        roadmapCounts[key] += 1;
      }
    });

    Object.keys(roadmapCompletion).forEach(key => {
      if (roadmapCounts[key] > 0) {
        roadmapCompletion[key] = Math.round(roadmapCompletion[key] / roadmapCounts[key]);
      }
    });

    // Compute difficult levels
    const UserActivity = require('../models/UserActivity');
    const activities = await UserActivity.find({}, 'userId assessments videosWatched').lean();
    const assessmentStats = {};
    
    activities.forEach(act => {
      if (act.assessments) {
        act.assessments.forEach(ass => {
          if (ass.assessmentId) {
            if (!assessmentStats[ass.assessmentId]) {
              assessmentStats[ass.assessmentId] = { title: ass.title, attempts: 0, failures: 0 };
            }
            assessmentStats[ass.assessmentId].attempts += 1;
            if (!ass.passed) {
              assessmentStats[ass.assessmentId].failures += 1;
            }
          }
        });
      }
    });

    const difficultLevels = Object.values(assessmentStats)
      .map(s => ({
        title: s.title || 'Validation Quiz',
        failureRate: s.attempts > 0 ? Math.round((s.failures / s.attempts) * 100) : 0,
        attempts: s.attempts
      }))
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 5);

    // Compute most skipped videos
    const Topic = require('../models/Topic');
    const allTopics = await Topic.find({ isActive: true }, 'title youtubeLink').lean();
    const topicMap = {};
    allTopics.forEach(t => {
      topicMap[t._id.toString()] = t;
    });

    const skippedVideosMap = {};
    allUsers.forEach(u => {
      if (u.activeDomain) {
        const key = getProgressKey(u.activeDomain.slug);
        const completed = u.domainsProgress?.[key]?.completedTopics || [];
        completed.forEach(ct => {
          const tId = ct.topicId?.toString() || ct.toString();
          const topicObj = topicMap[tId];
          if (topicObj) {
            const userActivityObj = activities.find(a => a.userId?.toString() === u._id.toString());
            const watchLog = userActivityObj?.videosWatched?.find(vw => vw.videoId === tId);
            const pct = watchLog ? watchLog.completionPercentage : 0;
            if (pct < 50) {
              if (!skippedVideosMap[tId]) {
                skippedVideosMap[tId] = { title: topicObj.title, skipCount: 0 };
              }
              skippedVideosMap[tId].skipCount += 1;
            }
          }
        });
      }
    });

    const mostSkippedVideos = Object.values(skippedVideosMap)
      .sort((a, b) => b.skipCount - a.skipCount)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalMentors,
        totalDomains,
        totalAssessments,
        totalProblems,
        publishedProblems,
        totalSubmissions,
        studentsOnLevel,
        roadmapCompletion,
        difficultLevels,
        mostSkippedVideos
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user progress/XP/profile (admin)
exports.updateUserProgress = async (req, res) => {
  try {
    const { xp, overallProgress, currentPhase, profile, activeDomain } = req.body;
    const user = await User.findById(req.params.id).populate('activeDomain');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (profile !== undefined) {
      user.profile = { ...user.profile.toObject(), ...profile };
    }

    // Safely update domainsProgress
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

    if (activeDomain !== undefined) {
      user.activeDomain = activeDomain || null;
      if (activeDomain) {
        const Domain = require('../models/Domain');
        const domain = await Domain.findById(activeDomain);
        if (domain) {
          const key = getProgressKey(domain.slug);
          if (!user.domainsProgress) user.domainsProgress = {};
          if (!user.domainsProgress[key]) {
            user.domainsProgress[key] = {
              xp: 0,
              currentPhase: 0,
              overallProgress: 0,
              completedTopics: [],
              startedTopics: [],
              testResults: [],
              codeSubmissions: []
            };
          }
          user.markModified(`domainsProgress.${key}`);
        }
      }
      await user.populate('activeDomain');
    }

    const key = getProgressKey(user.activeDomain?.slug);
    if (!user.domainsProgress) user.domainsProgress = {};
    if (!user.domainsProgress[key]) {
      user.domainsProgress[key] = {
        xp: 0,
        currentPhase: 0,
        overallProgress: 0,
        completedTopics: [],
        startedTopics: [],
        testResults: [],
        codeSubmissions: []
      };
    }

    if (xp !== undefined) user.domainsProgress[key].xp = xp;
    if (overallProgress !== undefined) user.domainsProgress[key].overallProgress = overallProgress;
    if (currentPhase !== undefined) user.domainsProgress[key].currentPhase = currentPhase;

    user.markModified(`domainsProgress.${key}`);

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password').populate('activeDomain');
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Reset a user's DevOps onboarding
// @route   POST /api/admin/users/:id/reset-onboarding
exports.resetOnboardingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.profile) user.profile = {};
    user.profile.onboardingCompleted = false;
    user.profile.isProfileComplete = false;
    user.profile.startingLevel = 0;
    user.profile.skillAssessmentAnswers = {};

    if (!user.domainsProgress) user.domainsProgress = {};
    if (!user.domainsProgress.devops) user.domainsProgress.devops = {};
    user.domainsProgress.devops.currentPhase = 0;
    user.domainsProgress.devops.overallProgress = 0;
    user.domainsProgress.devops.completedTopics = [];
    user.domainsProgress.devops.startedTopics = [];
    user.domainsProgress.devops.testResults = [];
    user.domainsProgress.devops.codeSubmissions = [];

    user.markModified('profile');
    user.markModified('domainsProgress.devops');

    await user.save();

    res.json({ success: true, message: 'Onboarding reset successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Run global roadmap progress migration and repair
// @route   POST /api/admin/migrate-roadmaps
exports.runRoadmapMigrationAdmin = async (req, res) => {
  try {
    const runRoadmapMigration = require('../scripts/roadmapMigration');
    const report = await runRoadmapMigration();
    res.json({ success: true, message: 'Roadmap progress migration ran successfully', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
