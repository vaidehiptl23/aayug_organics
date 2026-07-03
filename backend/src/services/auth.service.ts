import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { mailer } from '../emails/mailer';
import {
  signAccessToken,
  signRefreshToken,
  signEmailToken,
  verifyRefreshToken,
  verifyEmailToken,
} from '../utils/jwt';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/appError';
import { omitFields } from '../utils/helpers';

export class AuthService {
  private userRepo = new UserRepository();

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError('An account with this email already exists');

    const hashed = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);
    const user = await this.userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashed,
      phone: data.phone,
    });

    const token = signEmailToken({ userId: user.id, email: user.email, purpose: 'verify' });
    await mailer.sendVerificationEmail(user.email, user.firstName, token);

    return omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry']);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundError('Email not registered');
    if (!user.isActive) throw new UnauthorizedError('Account is inactive');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: omitFields(user, ['password', 'emailVerifyToken', 'emailVerifyExpiry']),
    };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
  }

  async refreshTokens(token: string) {
    const stored = await prisma.refreshToken.findFirst({
      where: { token, isRevoked: false },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired or invalid');
    }

    const payload = verifyRefreshToken(token);
    const user = await this.userRepo.findById(payload.userId);
    if (!user) throw new UnauthorizedError('User not found');

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async verifyEmail(token: string) {
    const payload = verifyEmailToken(token, 'verify');
    const user = await this.userRepo.findById(payload.userId);
    if (!user) throw new NotFoundError('User');
    if (user.isEmailVerified) throw new BadRequestError('Email already verified');

    await this.userRepo.update(user.id, { isEmailVerified: true, emailVerifyToken: null });
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If this email exists, a reset link has been sent' };

    const token = signEmailToken({ userId: user.id, email: user.email, purpose: 'reset' });
    await mailer.sendPasswordResetEmail(user.email, user.firstName, token);
    return { message: 'If this email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = verifyEmailToken(token, 'reset');
    const user = await this.userRepo.findById(payload.userId);
    if (!user) throw new NotFoundError('User');

    const hashed = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
    await this.userRepo.update(user.id, { password: hashed });
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestError('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
    await this.userRepo.update(userId, { password: hashed });
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
