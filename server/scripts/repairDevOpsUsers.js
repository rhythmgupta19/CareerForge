const mongoose = require('mongoose');
const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const DevOpsAssessment = require('../models/DevOpsAssessment');
const UserAssessmentProgress = require('../models/UserAssessmentProgress');

async function repairDevOpsProgress() {
  try {
    console.log('🤖 Starting DevOps user progress repair migration...');
    
    // Find DevOps domain
    const devopsDomain = await Domain.findOne({ slug: 'devops' });
    if (!devopsDomain) {
      console.error('❌ DevOps domain not found in database. Skipping repair.');
      return { success: false, message: 'DevOps domain not found.' };
    }

    const phases = await Phase.find({ domainId: devopsDomain._id }).sort('phaseNumber');
    const users = await User.find({});

    let repairedCount = 0;

    for (let user of users) {
      if (!user.domainsProgress || !user.domainsProgress.devops) continue;

      const progress = user.domainsProgress.devops;
      const initialPhase = progress.currentPhase || 0;
      let calculatedPhase = 0;

      // Loop through phases sequentially to check if they are complete
      for (let phase of phases) {
        const topics = await Topic.find({ phaseId: phase._id, isActive: true });
        if (topics.length === 0) {
          if (calculatedPhase === phase.phaseNumber) {
            calculatedPhase = phase.phaseNumber + 1;
          }
          continue;
        }

        const topicsIds = topics.map(t => t._id.toString());
        const completedTopics = progress.completedTopics.filter(t => 
          topicsIds.includes(t.topicId.toString())
        );

        // Find configured assessments for these topics
        const configuredAssessments = await DevOpsAssessment.find({ moduleId: { $in: topics.map(t => t._id) } });
        const configuredModuleIds = configuredAssessments.map(a => a.moduleId.toString());

        const passedCount = await UserAssessmentProgress.countDocuments({
          userId: user._id,
          moduleId: { $in: configuredModuleIds },
          passed: true
        });

        const allTopicsCompleted = completedTopics.length === topics.length;
        const allAssessmentsPassed = passedCount >= configuredModuleIds.length;

        if (allTopicsCompleted && allAssessmentsPassed) {
          calculatedPhase = phase.phaseNumber + 1;
        } else {
          calculatedPhase = phase.phaseNumber;
          break;
        }
      }

      // Cap calculatedPhase to the maximum available phase number
      const maxPhaseNum = phases.length > 0 ? phases[phases.length - 1].phaseNumber : 0;
      if (calculatedPhase > maxPhaseNum) {
        calculatedPhase = maxPhaseNum;
      }

      if (calculatedPhase !== initialPhase) {
        console.log(`👤 User: ${user.email || user._id} -> Level ${initialPhase} repaired to Level ${calculatedPhase}`);
        progress.currentPhase = calculatedPhase;
        user.markModified('domainsProgress.devops');
        await user.save();
        repairedCount++;
      }
    }

    console.log(`✅ DevOps User progress repair complete. Total users repaired: ${repairedCount}`);
    return { success: true, repairedCount };
  } catch (err) {
    console.error('❌ Error during DevOps user progress repair:', err);
    return { success: false, error: err.message };
  }
}

// Standalone execution support
if (require.main === module) {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:59639/test'; // local in-memory fallback
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => repairDevOpsProgress())
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error('Standalone script failure:', err);
    process.exit(1);
  });
}

module.exports = repairDevOpsProgress;
