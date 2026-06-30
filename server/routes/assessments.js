const express = require('express');
const router = express.Router();
const c = require('../controllers/assessmentController');
const devopsC = require('../controllers/devOpsAssessmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/domain/:domainId', protect, c.getAssessmentsByDomain);
router.get('/', protect, authorize('admin'), c.getAllAssessments);
router.post('/', protect, authorize('admin'), c.createAssessment);
router.put('/:id', protect, authorize('admin'), c.updateAssessment);
router.delete('/:id', protect, authorize('admin'), c.deleteAssessment);

// DevOps Mini Assessment Routes
router.get('/module/:moduleId', protect, devopsC.getAssessmentByModule);
router.post('/submit', protect, devopsC.submitAssessment);

// DevOps Level Assessment Routes
router.get('/level/:levelId', protect, devopsC.getLevelAssessment);
router.post('/level/submit', protect, devopsC.submitLevelAssessment);
router.post('/level/complete-without-assessment', protect, devopsC.completeLevelWithoutAssessment);


// Admin DevOps MCQ Routes
router.get('/admin/all', protect, authorize('admin'), devopsC.getAllAssessmentsAdmin);
router.post('/admin/reorder', protect, authorize('admin'), devopsC.reorderAssessmentsAdmin);
router.post('/admin/save', protect, authorize('admin'), devopsC.saveAssessmentAdmin);
router.delete('/admin/:id', protect, authorize('admin'), devopsC.deleteAssessmentAdmin);
router.get('/admin/stats/:moduleId', protect, authorize('admin'), devopsC.getAssessmentStats);
router.get('/admin/scores/:moduleId', protect, authorize('admin'), devopsC.getAssessmentScores);


module.exports = router;
