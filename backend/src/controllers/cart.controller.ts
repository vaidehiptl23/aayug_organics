import { Response } from 'express';
import { CartService } from '../services/cart.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/apiResponse';

const cartService = new CartService();

export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await cartService.getCart(req.user!.userId);
  sendSuccess(res, result);
};

export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const cart = await cartService.addToCart(req.user!.userId, req.body.productId, req.body.quantity);
  sendSuccess(res, cart, 'Item added to cart', 201);
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const cart = await cartService.updateCartItem(req.user!.userId, req.params.productId, req.body.quantity);
  sendSuccess(res, cart, 'Cart updated');
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const cart = await cartService.removeFromCart(req.user!.userId, req.params.productId);
  sendSuccess(res, cart, 'Item removed from cart');
};

export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await cartService.clearCart(req.user!.userId);
  sendSuccess(res, null, 'Cart cleared');
};
