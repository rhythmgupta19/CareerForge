const express = require('express');
const router = express.Router();
const c = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, c.getProjects);
router.get('/:id', protect, c.getProjectById);
router.post('/', protect, authorize('admin'), c.createProject);
router.put('/:id', protect, authorize('admin'), c.updateProject);
router.delete('/:id', protect, authorize('admin'), c.deleteProject);

module.exports = router;
