import * as admin from 'firebase-admin';
import { User } from '../models';
import { config } from '../config';

export class EmailService {
  /**
   * Send email verification
   */
  static async sendVerificationEmail(email: string) {
    try {
      // Check if user exists
      const userDoc = await User.findOne({ email });
      if (!userDoc) {
        throw new Error('User not found');
      }

      const user = userDoc.toObject() as any;

      // Generate email verification link using Firebase
      const verificationLink = await admin.auth().generateEmailVerificationLink(email);

      // Update user with verification token (optional, if you want to track it)
      (userDoc as any).emailVerificationToken = verificationLink;
      (userDoc as any).emailVerificationExpires = new Date(Date.now() + 24 * 3600000); // 24 hours expiry
      await userDoc.save();

      return { message: 'Verification email sent successfully', verificationLink };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /**
   * Verify email using token
   */
  static async verifyEmail(token: string) {
    try {
      // Find user with valid verification token
      const userDoc = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!userDoc) {
        throw new Error('Invalid or expired verification token');
      }

      const user = userDoc.toObject() as any;

      // Update email verification status in Firebase
      await admin.auth().updateUser(user.firebaseUid, {
        emailVerified: true
      });

      // Clear verification token fields
      (userDoc as any).emailVerificationToken = undefined;
      (userDoc as any).emailVerificationExpires = undefined;
      (userDoc as any).emailVerified = true;
      await userDoc.save();

      return { message: 'Email verified successfully' };
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  /**
   * Check if email is verified
   */
  static async isEmailVerified(userId: string) {
    try {
      const userDoc = await User.findById(userId);
      if (!userDoc) {
        throw new Error('User not found');
      }

      const user = userDoc.toObject() as any;
      return user.emailVerified || false;
    } catch (error) {
      console.error('Error checking email verification:', error);
      throw error;
    }
  }
} 