import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/apiResponse';

const reviewService = new ReviewService();

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const review = await reviewService.createReview(req.user!.userId, req.params.productId, req.body);
  sendCreated(res, review, 'Review submitted for moderation');
};

export const updateReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const review = await reviewService.updateReview(req.user!.userId, req.params.id, req.body);
  sendSuccess(res, review, 'Review updated');
};

export const deleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await reviewService.deleteReview(req.user!.userId, req.params.id);
  sendSuccess(res, null, 'Review deleted');
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const result = await reviewService.getProductReviews(req.params.productId, page, limit);
  const meta = buildPaginationMeta(result.total, parseInt(page || '1'), parseInt(limit || '20'));
  sendSuccess(res, result.reviews, 'Reviews retrieved', 200, meta);
};

// Admin
export const moderateReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const review = await reviewService.moderateReview(req.params.id, req.body.status);
  sendSuccess(res, review, 'Review moderated');
};

export const getPendingReviews = async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const reviews = await reviewService.getPendingReviews(page, limit);
  sendSuccess(res, reviews);
};

export const adminDeleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await reviewService.deleteReview(req.user!.userId, req.params.id, true);
  sendSuccess(res, null, 'Review deleted');
};
