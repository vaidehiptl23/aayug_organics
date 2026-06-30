import { Response } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/apiResponse';

const wishlistService = new WishlistService();

export const getWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const items = await wishlistService.getWishlist(req.user!.userId);
  sendSuccess(res, items);
};

export const addToWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const items = await wishlistService.addToWishlist(req.user!.userId, req.params.productId);
  sendSuccess(res, items, 'Added to wishlist', 201);
};

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const items = await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId);
  sendSuccess(res, items, 'Removed from wishlist');
};
