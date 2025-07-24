import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
} from '../controller/jobcontroller.js';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validations.js';
import {
  createJobSchema,
  updateJobSchema,
  toggleStatusSchema,
} from '../validations/jobvalidation.js';

const router = express.Router();

router.post('/', isAuthenticated, isAdmin, validate(createJobSchema), createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.patch('/:id', isAuthenticated, isAdmin, validate(updateJobSchema), updateJob);
router.delete('/:id', isAuthenticated, isAdmin, deleteJob);
router.patch('/:id/status', isAuthenticated, isAdmin, validate(toggleStatusSchema), toggleJobStatus);

export default router;
