const mongoose = require('mongoose');
const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const DevOpsAssessment = require('../models/DevOpsAssessment');
const UserAssessmentProgress = require('../models/UserAssessmentProgress');
const UserActivity = require('../models/UserActivity');

async function runRoadmapMigration() {
  const report = {
    startedAt: new Date(),
    completedAt: null,
    totalUsersScanned: 0,
    totalUsersRepaired: 0,
    details: []
  };

  try {
    console.log('🏁 Starting Global Roadmap Progress Reconciliation Migration...');

    // 1. Fetch all domains, phases, and active topics
    const allDomains = await Domain.find({});
    const allPhases = await Phase.find({}).sort('phaseNumber');
    const allTopics = await Topic.find({ isActive: true });

    // 2. Fetch all users
    const allUsers = await User.find({});
    report.totalUsersScanned = allUsers.length;

    // Helper to get progress key
    const getProgressKey = (slug) => {
      if (!slug) return 'dsa';
      const lowercaseSlug = slug.toLowerCase();
      if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
      if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
      if (lowercaseSlug === 'devops') return 'devops';
      if (lowercaseSlug === 'dsa') return 'dsa';
      return 'dsa';
    };

    for (let user of allUsers) {
      if (!user.domainsProgress) continue;

      let userRepaired = false;
      const userRepairDetails = {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        changes: []
      };

      // Fetch user activity log once
      const userActivity = await UserActivity.findOne({ userId: user._id });
      
      // Fetch user assessment progress records once
      const assessmentProgress = await UserAssessmentProgress.find({ userId: user._id, passed: true });

      // Loop through each domain
      for (const domain of allDomains) {
        const key = getProgressKey(domain.slug);
        const progress = user.domainsProgress[key];
        if (!progress) continue;

        // Ensure array structures
        if (!progress.completedTopics) progress.completedTopics = [];
        if (!progress.startedTopics) progress.startedTopics = [];

        const domainTopics = allTopics.filter(t => t.domainId.toString() === domain._id.toString());
        const domainPhases = allPhases.filter(p => p.domainId.toString() === domain._id.toString());

        if (domainTopics.length === 0) continue;

        let domainRepaired = false;
        const domainChanges = {
          domain: domain.name,
          topicsAdded: [],
          oldProgress: progress.overallProgress || 0,
          newProgress: progress.overallProgress || 0,
          oldPhase: progress.currentPhase ?? 0,
          newPhase: progress.currentPhase ?? 0
        };

        // 1. CHECK WATCHED VIDEOS & AUTO-COMPLETE TOPICS
        if (userActivity && userActivity.videosWatched) {
          for (const video of userActivity.videosWatched) {
            // A video counts as watched if completion is high (>= 90%) or watchTime > 60s
            const isWatched = video.completionPercentage >= 90 || video.watchTime >= 60;
            if (!isWatched) continue;

            // Find topic that matches this videoId (or video's youtube URL if saved)
            const topic = domainTopics.find(t => 
              t._id.toString() === video.videoId || 
              (t.youtubeLink && t.youtubeLink.includes(video.videoId)) ||
              t.title.toLowerCase() === video.title.toLowerCase()
            );

            if (topic) {
              const alreadyCompleted = progress.completedTopics.some(ct => ct.topicId.toString() === topic._id.toString());
              if (!alreadyCompleted) {
                // If it's a DevOps domain, it must have also passed the assessment if configured
                let canAutoComplete = true;
                if (key === 'devops') {
                  const devopsAssessment = await DevOpsAssessment.findOne({ moduleId: topic._id });
                  if (devopsAssessment) {
                    const hasPassed = assessmentProgress.some(ap => ap.moduleId && ap.moduleId.toString() === topic._id.toString());
                    if (!hasPassed) canAutoComplete = false;
                  }
                }

                if (canAutoComplete) {
                  progress.completedTopics.push({
                    topicId: topic._id,
                    completedAt: video.lastWatchedAt || new Date(),
                    studyTimeMinutes: Math.round(video.watchTime / 60) || 10,
                    notes: 'Auto-completed via video watch history reconciliation.',
                    confidenceLevel: 4,
                    revisionNeeded: false
                  });
                  domainChanges.topicsAdded.push(`${topic.title} (from video watch)`);
                  domainRepaired = true;
                }
              }
            }
          }
        }

        // 2. CHECK COMPLETED ASSESSMENTS & AUTO-COMPLETE TOPICS
        for (const ap of assessmentProgress) {
          if (ap.moduleId && ap.roadmapId.toString() === domain._id.toString()) {
            const topic = domainTopics.find(t => t._id.toString() === ap.moduleId.toString());
            if (topic) {
              const alreadyCompleted = progress.completedTopics.some(ct => ct.topicId.toString() === topic._id.toString());
              if (!alreadyCompleted) {
                progress.completedTopics.push({
                  topicId: topic._id,
                  completedAt: ap.completedAt || new Date(),
                  studyTimeMinutes: 15,
                  notes: 'Auto-completed via passed assessment reconciliation.',
                  confidenceLevel: 5,
                  revisionNeeded: false
                });
                domainChanges.topicsAdded.push(`${topic.title} (from assessment pass)`);
                domainRepaired = true;
              }
            }
          }
        }

        // 3. RECALCULATE ROADMAP OVERALL PROGRESS
        const completedTopicsIds = progress.completedTopics.map(ct => ct.topicId.toString());
        const activeCompletedCount = domainTopics.filter(t => completedTopicsIds.includes(t._id.toString())).length;
        const recalculatedProgress = Math.round((activeCompletedCount / domainTopics.length) * 100);

        if (recalculatedProgress !== progress.overallProgress) {
          domainChanges.newProgress = recalculatedProgress;
          progress.overallProgress = recalculatedProgress;
          domainRepaired = true;
        }

        // 4. UNLOCK LEVELS & REMOVE INVALID LOCKS
        // Start from onboarding startingLevel
        const startingLevel = (user.profile && user.profile.startingLevel) || 0;
        let calculatedPhase = startingLevel;

        for (const phase of domainPhases) {
          if (phase.phaseNumber < startingLevel) continue;

          const phaseTopics = domainTopics.filter(t => t.phaseId.toString() === phase._id.toString());
          if (phaseTopics.length === 0) {
            if (calculatedPhase === phase.phaseNumber) {
              calculatedPhase = phase.phaseNumber + 1;
            }
            continue;
          }

          const phaseTopicIds = phaseTopics.map(t => t._id.toString());
          const completedInPhase = progress.completedTopics.filter(ct => 
            phaseTopicIds.includes(ct.topicId.toString())
          );

          let isPhaseComplete = false;

          if (key === 'devops') {
            // DevOps requires topics + assessments
            const configuredDevopsAssessments = await DevOpsAssessment.find({ moduleId: { $in: phaseTopics.map(t => t._id) } });
            const configuredModuleIds = configuredDevopsAssessments.map(a => a.moduleId.toString());

            const passedInPhaseCount = assessmentProgress.filter(ap => 
              ap.moduleId && configuredModuleIds.includes(ap.moduleId.toString())
            ).length;

            const allTopicsDone = completedInPhase.length === phaseTopics.length;
            const allAssessmentsDone = passedInPhaseCount >= configuredModuleIds.length;

            isPhaseComplete = allTopicsDone && allAssessmentsDone;
          } else {
            isPhaseComplete = completedInPhase.length === phaseTopics.length;
          }

          if (isPhaseComplete) {
            calculatedPhase = phase.phaseNumber + 1;
          } else {
            break;
          }
        }

        // Cap to max phase available
        const maxPhaseNum = domainPhases.length > 0 ? domainPhases[domainPhases.length - 1].phaseNumber : 0;
        if (calculatedPhase > maxPhaseNum) {
          calculatedPhase = maxPhaseNum;
        }

        // Check user's highest phase with any activity (completed or started topics) to prevent accidental locking
        let maxPhaseWithActivity = -1;
        const allUserActiveTopicIds = [
          ...progress.completedTopics.map(t => t.topicId.toString()),
          ...progress.startedTopics.map(t => t.topicId.toString())
        ];

        for (const topicId of allUserActiveTopicIds) {
          const topicObj = domainTopics.find(t => t._id.toString() === topicId);
          if (topicObj && topicObj.phaseId) {
            const phaseObj = domainPhases.find(p => p._id.toString() === topicObj.phaseId.toString());
            if (phaseObj && phaseObj.phaseNumber > maxPhaseWithActivity) {
              maxPhaseWithActivity = phaseObj.phaseNumber;
            }
          }
        }

        // The safe level is the max of calculated unlocked level, onboarding starting level, and level with activity
        const finalPhase = Math.max(calculatedPhase, startingLevel, maxPhaseWithActivity, progress.currentPhase || 0);

        if (finalPhase !== progress.currentPhase) {
          domainChanges.newPhase = finalPhase;
          progress.currentPhase = finalPhase;
          domainRepaired = true;
        }

        if (domainRepaired) {
          userRepairDetails.changes.push(domainChanges);
          userRepaired = true;
        }
      }

      if (userRepaired) {
        user.markModified('domainsProgress');
        await user.save();
        userRepairDetails.changes = userRepairDetails.changes.filter(c => 
          c.topicsAdded.length > 0 || c.oldProgress !== c.newProgress || c.oldPhase !== c.newPhase
        );
        if (userRepairDetails.changes.length > 0) {
          report.details.push(userRepairDetails);
          report.totalUsersRepaired += 1;
        }
      }
    }

    report.completedAt = new Date();
    console.log(`✅ Roadmap progress reconciliation complete. Total users repaired: ${report.totalUsersRepaired}`);
  } catch (err) {
    console.error('❌ Migration failed with error:', err);
    throw err;
  }

  return report;
}

module.exports = runRoadmapMigration;
