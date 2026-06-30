import { Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, buildPaginationMeta } from '../utils/apiResponse';
import { getFileUrl } from '../middlewares/upload';

const userService = new UserService();

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await userService.getProfile(req.user!.userId);
  sendSuccess(res, user);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await userService.updateProfile(req.user!.userId, req.body);
  sendSuccess(res, user, 'Profile updated');
};

export const uploadProfileImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const file = req.file!;
  const imageUrl = getFileUrl(req, 'profiles', file.filename);
  const user = await userService.updateProfileImage(req.user!.userId, imageUrl);
  sendSuccess(res, user, 'Profile image updated');
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await userService.deleteAccount(req.user!.userId);
  sendSuccess(res, null, 'Account deleted successfully');
};

// Addresses
export const getAddresses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const addresses = await userService.getAddresses(req.user!.userId);
  sendSuccess(res, addresses);
};

export const addAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const address = await userService.addAddress(req.user!.userId, req.body);
  sendSuccess(res, address, 'Address added', 201);
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const address = await userService.updateAddress(req.user!.userId, req.params.id, req.body);
  sendSuccess(res, address, 'Address updated');
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await userService.deleteAddress(req.user!.userId, req.params.id);
  sendSuccess(res, null, 'Address deleted');
};

export const setDefaultAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const address = await userService.setDefaultAddress(req.user!.userId, req.params.id);
  sendSuccess(res, address, 'Default address updated');
};

// Admin
export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, search } = req.query as { page?: string; limit?: string; search?: string };
  const { users, total } = await userService.getAllUsers(page, limit, search);
  const meta = buildPaginationMeta(total, parseInt(page || '1'), parseInt(limit || '20'));
  sendSuccess(res, users, 'Users retrieved', 200, meta);
};
