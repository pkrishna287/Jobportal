import express from 'express';
const router = express.Router();
import { register, login,logout , currentUser} from "../controller/authcontroller.js";
import { validate } from '../middleware/validations.js';
import { registerSchema, loginSchema } from'../validations/authvalidation.js';
import {isAuthenticated,isAdmin} from '../middleware/auth.js'

router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me',isAuthenticated ,currentUser); 

export default router;
