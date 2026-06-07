const express = require('express');
const router = express.Router();
const c = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, c.getBlogs);
router.get('/:id', protect, c.getBlogById);
router.post('/', protect, authorize('admin'), c.createBlog);
router.put('/:id', protect, authorize('admin'), c.updateBlog);
router.delete('/:id', protect, authorize('admin'), c.deleteBlog);

module.exports = router;
