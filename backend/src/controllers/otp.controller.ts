import { Request, Response } from 'express';
import { otpService } from '../services/otp.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { BadRequestError } from '../utils/appError';

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) throw new BadRequestError('Phone number is required');
  
  await otpService.generateOtp(phone);
  sendSuccess(res, null, 'Verification code sent successfully');
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone, code } = req.body;
  if (!phone || !code) throw new BadRequestError('Phone number and verification code are required');

  const result = await otpService.verifyOtp(phone, code);
  sendSuccess(res, result, 'Verification code verified successfully');
};

export const completeOtpProfile = async (req: Request, res: Response): Promise<void> => {
  const { phone, firstName, lastName, email } = req.body;
  if (!phone || !firstName || !lastName || !email) {
    throw new BadRequestError('All fields (phone, firstName, lastName, email) are required');
  }

  const result = await otpService.completeOtpProfile({ phone, firstName, lastName, email });
  sendCreated(res, result, 'Profile completed and logged in successfully');
};
