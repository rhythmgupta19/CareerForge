const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const TerminalSession = require('../models/TerminalSession');
const TerminalProgress = require('../models/TerminalProgress');
const TerminalLab = require('../models/TerminalLab');
const User = require('../models/User');
const { executeCommand, validateLabProgress } = require('../services/terminalService');

// Get all terminal labs/exercises
router.get('/labs', protect, async (req, res) => {
  try {
    const labs = await TerminalLab.find({});
    res.json({ success: true, labs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get session progress for user + topic
router.get('/progress/:topicId', protect, async (req, res) => {
  try {
    const { topicId } = req.params;
    let progress = await TerminalProgress.findOne({ userId: req.user._id, topicId });
    if (!progress) {
      progress = await TerminalProgress.create({
        userId: req.user._id,
        topicId,
        completedLabs: [],
        commandsExecutedCount: 0,
        practiceTimeSeconds: 0
      });
    }
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Execute command in simulated sandbox VFS
router.post('/execute', protect, async (req, res) => {
  try {
    const { command, topicId, activeLabId } = req.body;
    if (!command || !topicId) {
      return res.status(400).json({ success: false, message: 'Command and topicId are required' });
    }
    
    // Find or create terminal session
    let session = await TerminalSession.findOne({ userId: req.user._id, topicId });
    if (!session) {
      let initialVfs = undefined;
      if (activeLabId) {
        const lab = await TerminalLab.findOne({ labId: activeLabId });
        if (lab && lab.initialVfs) initialVfs = lab.initialVfs;
      }
      
      session = await TerminalSession.create({
        userId: req.user._id,
        topicId,
        vfs: initialVfs
      });
    }
    
    // Find or create progress
    let progress = await TerminalProgress.findOne({ userId: req.user._id, topicId });
    if (!progress) {
      progress = await TerminalProgress.create({ userId: req.user._id, topicId });
    }
    
    // Execute command simulator
    const result = await executeCommand(session, command);
    progress.commandsExecutedCount += 1;
    progress.lastActiveSession = new Date();
    
    // Validate exercises if lab is selected
    let xpEarned = 0;
    let labCompleted = false;
    if (activeLabId) {
      const validation = await validateLabProgress(session, progress, activeLabId);
      if (validation.success) {
        xpEarned = validation.xp;
        labCompleted = true;
        
        // Reward user with XP
        await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpEarned } });
      }
    }
    
    // Save state
    session.markModified('vfs');
    session.markModified('git');
    session.markModified('docker');
    session.markModified('k8s');
    await session.save();
    
    progress.markModified('completedLabs');
    await progress.save();
    
    res.json({
      success: true,
      output: result.output,
      currentDir: result.currentDir,
      completedLabs: progress.completedLabs,
      xpEarned,
      labCompleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset session VFS
router.post('/reset', protect, async (req, res) => {
  try {
    const { topicId, activeLabId } = req.body;
    if (!topicId) {
      return res.status(400).json({ success: false, message: 'topicId is required' });
    }
    
    let initialVfs = undefined;
    if (activeLabId) {
      const lab = await TerminalLab.findOne({ labId: activeLabId });
      if (lab && lab.initialVfs) initialVfs = lab.initialVfs;
    }
    
    await TerminalSession.findOneAndDelete({ userId: req.user._id, topicId });
    
    const fields = {
      userId: req.user._id,
      topicId
    };
    if (initialVfs) {
      fields.vfs = initialVfs;
    }
    const newSession = await TerminalSession.create(fields);
    
    res.json({
      success: true,
      currentDir: newSession.currentDir,
      message: 'Terminal session reset successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Time Sync Tracker
router.post('/time-sync', protect, async (req, res) => {
  try {
    const { topicId, durationSeconds } = req.body;
    if (!topicId || !durationSeconds) {
      return res.status(400).json({ success: false, message: 'topicId and durationSeconds are required' });
    }
    
    let progress = await TerminalProgress.findOne({ userId: req.user._id, topicId });
    if (!progress) {
      progress = await TerminalProgress.create({ userId: req.user._id, topicId });
    }
    
    progress.practiceTimeSeconds += Number(durationSeconds);
    await progress.save();
    
    res.json({ success: true, practiceTimeSeconds: progress.practiceTimeSeconds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN ENDPOINTS

// Get all active sessions
router.get('/admin/sessions', protect, authorize('admin'), async (req, res) => {
  try {
    const sessions = await TerminalSession.find({})
      .populate('userId', 'fullName email')
      .populate('topicId', 'title');
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset specific user's session
router.post('/admin/reset-session', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, topicId } = req.body;
    await TerminalSession.findOneAndDelete({ userId, topicId });
    res.json({ success: true, message: 'Student terminal session reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create or update predefined lab environment
router.post('/admin/labs', protect, authorize('admin'), async (req, res) => {
  try {
    const lab = req.body;
    const newLab = await TerminalLab.findOneAndUpdate(
      { labId: lab.labId },
      lab,
      { upsert: true, new: true }
    );
    res.json({ success: true, lab: newLab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
