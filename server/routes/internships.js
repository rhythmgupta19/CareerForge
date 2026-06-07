const express = require('express');
const router = express.Router();
const c = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, c.getInternships);
router.get('/:id', protect, c.getInternshipById);
router.post('/', protect, authorize('admin'), c.createInternship);
router.put('/:id', protect, authorize('admin'), c.updateInternship);
router.delete('/:id', protect, authorize('admin'), c.deleteInternship);

module.exports = router;
