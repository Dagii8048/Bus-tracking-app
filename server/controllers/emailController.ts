import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';

interface AuthRequest extends Request {
  user?: any;
}

// Send verification email
export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await EmailService.sendVerificationEmail(email);
    res.json({ message: 'Verification email sent successfully' });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

// Verify email with token
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    await EmailService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    if (error.message === 'Invalid or expired verification token') {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Check email verification status
export const checkEmailVerification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const isVerified = await EmailService.isEmailVerified(userId);
    res.json({ isVerified });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to check email verification status' });
  }
}; 