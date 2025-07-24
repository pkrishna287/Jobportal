import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadOnsiteResume,
} from '../controller/profilecontroller.js';

import { isAuthenticated } from '../middleware/auth.js';
import { upload } from '../middleware/fileupload.js';

const router = express.Router();

router.get('/', isAuthenticated, getUserProfile);
router.patch('/', isAuthenticated,  updateUserProfile);
router.post(
  '/resume',
  isAuthenticated,
  upload.single('resume'),
  uploadOnsiteResume
);

export default router;
