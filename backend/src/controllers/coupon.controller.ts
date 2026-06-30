import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/apiResponse';

const couponService = new CouponService();

export const validateCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { code, cartTotal } = req.body;
  const result = await couponService.validateCoupon(code, req.user!.userId, cartTotal);
  sendSuccess(res, result, 'Coupon is valid');
};

export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const result = await couponService.getAllCoupons(page, limit);
  const meta = buildPaginationMeta(result.total, parseInt(page || '1'), parseInt(limit || '20'));
  sendSuccess(res, result.coupons, 'Coupons retrieved', 200, meta);
};

export const createCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const coupon = await couponService.createCoupon(req.body);
  sendCreated(res, coupon, 'Coupon created');
};

export const updateCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  sendSuccess(res, coupon, 'Coupon updated');
};

export const deleteCoupon = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await couponService.deleteCoupon(req.params.id);
  sendSuccess(res, null, 'Coupon deleted');
};
