import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { smsService } from './sms.service';
import { mailer } from '../emails/mailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/appError';
import { omitFields } from '../utils/helpers';

export class OtpService {
  /**
   * Generates a 6-digit OTP code, saves it to the database, and sends it via SMS.
   */
  async generateOtp(phone: string): Promise<void> {
    // Check if an active OTP was generated within the last 30 seconds to prevent race conditions
    const existing = await prisma.otp.findUnique({ where: { phone } });
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    
    if (existing && existing.createdAt > thirtySecondsAgo) {
      logger.info(`Re-sending existing OTP code ${existing.code} to ${phone} due to cooldown lock`);
      await smsService.sendOtp(phone, existing.code);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update the OTP in the database
    await prisma.otp.upsert({
      where: { phone },
      create: { phone, code, expiresAt },
      update: { code, expiresAt, createdAt: new Date() }
    });

    // Send SMS
    await smsService.sendOtp(phone, code);
  }

  /**
   * Verifies the OTP code. 
   * If correct, checks if user exists.
   * If user exists, signs tokens and logs them in.
   * If user is new, returns a verification status to prompt profile setup.
   */
  async verifyOtp(phone: string, code: string) {
    const record = await prisma.otp.findUnique({
      where: { phone }
    });

    if (!record) {
      throw new NotFoundError('No verification code was sent to this number');
    }

    if (record.expiresAt < new Date()) {
      await prisma.otp.delete({ where: { phone } }).catch(() => {});
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    // Allow '123456' as a universal bypass test code in development/simulation mode
    const isBypass = (!env.FAST2SMS_API_KEY && !env.TWILIO_ACCOUNT_SID && code === '123456');

    if (record.code !== code && !isBypass) {
      throw new BadRequestError('Invalid verification code');
    }

    // Delete the verified OTP
    await prisma.otp.delete({ where: { phone } }).catch(() => {});

    // Check if user already exists with this phone number
    let user = await prisma.user.findFirst({
      where: { phone }
    });

    if (user) {
      // Sign tokens and log them in
      const payload = { userId: user.id, email: user.email, role: user.role };
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      return {
        isNewUser: false,
        accessToken,
        refreshToken,
        user: omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry'])
      };
    }

    // Return new user status to initiate name and email registration on frontend
    return {
      isNewUser: true,
      phone
    };
  }

  /**
   * Completes registration for new OTP users by gathering email, firstName, and lastName.
   */
  async completeOtpProfile(data: {
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    // 1. Check if email already belongs to an account
    let user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (user) {
      // If user exists by email but doesn't have a phone, link it!
      if (!user.phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phone: data.phone }
        });
      } else {
        throw new ConflictError('An account with this email already exists with a different phone number');
      }
    } else {
      // 2. Create new user with a random dummy password (since they login via OTP)
      const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          isEmailVerified: true // Auto-verify email via OTP path
        }
      });
    }

    // 3. Generate tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      accessToken,
      refreshToken,
      user: omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry'])
    };
  }

  /**
   * Generates a 6-digit OTP code, saves it to the database, and sends it via Email.
   */
  async generateEmailOtp(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    // Check if an active OTP was generated within the last 30 seconds to prevent race conditions
    const existing = await prisma.otp.findUnique({ where: { email: cleanEmail } });
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    
    if (existing && existing.createdAt > thirtySecondsAgo) {
      logger.info(`Re-sending existing email OTP code ${existing.code} to ${cleanEmail} due to cooldown lock`);
      await mailer.sendOtpEmail(cleanEmail, existing.code);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update the OTP in the database
    await prisma.otp.upsert({
      where: { email: cleanEmail },
      create: { email: cleanEmail, code, expiresAt },
      update: { code, expiresAt, createdAt: new Date() }
    });

    // Send Email
    await mailer.sendOtpEmail(cleanEmail, code);
  }

  /**
   * Verifies the email OTP code.
   */
  async verifyEmailOtp(email: string, code: string) {
    const cleanEmail = email.toLowerCase().trim();
    const record = await prisma.otp.findUnique({
      where: { email: cleanEmail }
    });

    if (!record) {
      throw new NotFoundError('No verification code was sent to this email');
    }

    // Check expiry
    if (new Date() > record.expiresAt) {
      await prisma.otp.delete({ where: { email: cleanEmail } }).catch(() => {});
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    // Allow '123456' as a universal bypass test code in development/simulation mode
    const isBypass = (!env.SMTP_HOST && code === '123456');

    if (record.code !== code && !isBypass) {
      throw new BadRequestError('Invalid verification code');
    }

    // Delete the verified OTP
    await prisma.otp.delete({ where: { email: cleanEmail } }).catch(() => {});

    // Check if user already exists with this email
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (user) {
      // Sign tokens and log them in
      const payload = { userId: user.id, email: user.email, role: user.role };
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      return {
        isNewUser: false,
        accessToken,
        refreshToken,
        user: omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry'])
      };
    }

    return {
      isNewUser: true,
      email: cleanEmail
    };
  }

  /**
   * Completes registration for new Email OTP users.
   */
  async completeEmailOtpProfile(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const cleanEmail = data.email.toLowerCase().trim();
    
    // Check if phone belongs to another account
    if (data.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: data.phone }
      });
      if (existingPhone) {
        throw new ConflictError('An account with this phone number already exists');
      }
    }

    // Create new user with a random dummy password (since they login via OTP)
    const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: cleanEmail,
        phone: data.phone || null,
        password: hashedPassword,
        isEmailVerified: true // Verified via OTP path
      }
    });

    // Generate tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      accessToken,
      refreshToken,
      user: omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry'])
    };
  }
}

export const otpService = new OtpService();
