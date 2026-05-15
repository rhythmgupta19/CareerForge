import express from 'express';
import { getDomains, getDomainById, createDomain } from '../controllers/domainController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getDomains).post(protect, admin, createDomain);
router.route('/:id').get(getDomainById);

export default router;
