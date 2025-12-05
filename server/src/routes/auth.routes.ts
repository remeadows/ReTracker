import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
