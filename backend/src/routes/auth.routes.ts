import { Router } from 'express';
import 'express-async-errors';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { authRateLimiter } from '../middlewares/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, confirmPassword]
 *             properties:
 *               firstName: { type: string, example: Rahul }
 *               lastName: { type: string, example: Sharma }
 *               email: { type: string, example: rahul@example.com }
 *               phone: { type: string, example: '9876543210' }
 *               password: { type: string, example: Password123 }
 *               confirmPassword: { type: string, example: Password123 }
 *     responses:
 *       201: { description: Registered successfully }
 *       409: { description: Email already in use }
 */
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);

router.post('/logout', validate(refreshTokenSchema), authController.logout);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshTokens);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
