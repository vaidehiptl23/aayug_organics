import { Router } from 'express';
import 'express-async-errors';
import * as otpController from '../controllers/otp.controller';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Apply auth rate limiter to OTP operations to prevent spamming
router.post('/otp/send', authRateLimiter, otpController.sendOtp);
router.post('/otp/verify', authRateLimiter, otpController.verifyOtp);
router.post('/otp/complete-profile', authRateLimiter, otpController.completeOtpProfile);

// Email OTP routes
router.post('/otp/email/send', authRateLimiter, otpController.sendEmailOtp);
router.post('/otp/email/verify', authRateLimiter, otpController.verifyEmailOtp);
router.post('/otp/email/complete-profile', authRateLimiter, otpController.completeEmailOtpProfile);

export default router;
