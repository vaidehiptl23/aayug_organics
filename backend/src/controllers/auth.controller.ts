import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.register(req.body);
  sendCreated(res, user, 'Registration successful. Please verify your email.');
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body.email, req.body.password);
  sendSuccess(res, result, 'Login successful');
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
};

export const refreshTokens = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  sendSuccess(res, result, 'Tokens refreshed');
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query as { token: string };
  const result = await authService.verifyEmail(token);
  sendSuccess(res, result, 'Email verified successfully');
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, result, result.message);
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, null, 'Password reset successful');
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await authService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
  sendSuccess(res, null, 'Password changed successfully');
};
