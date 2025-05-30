import express from 'express';
import {
  sendVerificationEmail,
  verifyEmail,
  checkEmailVerification
} from '../controllers/emailController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/send-verification', sendVerificationEmail);
router.post('/verify', verifyEmail);

// Protected routes
router.use(auth);
router.get('/check-verification', checkEmailVerification);

export default router; 