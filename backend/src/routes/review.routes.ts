import { Router } from 'express';
import 'express-async-errors';
import * as reviewController from '../controllers/review.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { updateReviewSchema, moderateReviewSchema } from '../validators/review.validator';

const router = Router();

// Customer
router.patch('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

// Admin
router.get('/pending', authenticate, authorize('ADMIN'), reviewController.getPendingReviews);
router.patch('/:id/moderate', authenticate, authorize('ADMIN'), validate(moderateReviewSchema), reviewController.moderateReview);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), reviewController.adminDeleteReview);

export default router;
