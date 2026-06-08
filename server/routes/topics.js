const express = require('express');
const router = express.Router();
const c = require('../controllers/topicController');
const { protect, authorize, checkPhaseAccess } = require('../middleware/auth');

router.get('/phase/:phaseId', protect, checkPhaseAccess, c.getTopicsByPhase);
router.get('/all', protect, authorize('admin'), c.getAllTopics);
router.get('/:id', protect, checkPhaseAccess, c.getTopic);
router.post('/', protect, authorize('admin'), c.createTopic);
router.put('/:id', protect, authorize('admin'), c.updateTopic);
router.delete('/:id', protect, authorize('admin'), c.deleteTopic);

module.exports = router;
