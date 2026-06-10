const express = require('express');
const router = express.Router();
const c = require('../controllers/progressController');
const { protect, checkPhaseAccess } = require('../middleware/auth');

router.post('/select-domain', protect, c.selectDomain);
router.post('/start-topic', protect, checkPhaseAccess, c.startTopic);
router.post('/complete-topic', protect, checkPhaseAccess, c.completeTopic);
router.post('/submit-assessment', protect, checkPhaseAccess, c.submitAssessment);
router.post('/submit-mini-assessment', protect, checkPhaseAccess, c.submitMiniAssessment);
router.post('/study-time', protect, c.addStudyTime);
router.post('/submit-code', protect, checkPhaseAccess, c.submitCode);
router.get('/submissions/:topicId', protect, checkPhaseAccess, c.getSubmissions);
router.get('/dashboard', protect, c.getDashboard);
router.get('/heatmap', protect, c.getHeatmap);
router.post('/skip-phase', protect, checkPhaseAccess, c.skipPhase);
router.post('/video-progress', protect, checkPhaseAccess, c.saveVideoProgress);
router.post('/webdev-project', protect, checkPhaseAccess, c.saveWebDevProject);
router.get('/webdev-project/:topicId', protect, checkPhaseAccess, c.getWebDevProject);

module.exports = router;
