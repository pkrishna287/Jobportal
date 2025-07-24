import express from 'express';
import { getAdminStats } from '../controller/admincontroller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', isAuthenticated, isAdmin, getAdminStats);

export default router;
