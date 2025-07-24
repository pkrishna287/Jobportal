import express from 'express';
const router = express.Router();
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controller/appcontroller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/fileupload.js';
import { validate } from '../middleware/validations.js';
import {updateApplicationStatusSchema,createApplicationSchema } from '../validations/application.js';

router.post('/:jobId/apply', isAuthenticated, validate(createApplicationSchema),upload.single('resume'), createApplication);
router.get('/', isAuthenticated, isAdmin, getAllApplications);
router.get('/:id', isAuthenticated, isAdmin, getApplicationById);
router.patch('/:id/status', isAuthenticated, isAdmin, validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
