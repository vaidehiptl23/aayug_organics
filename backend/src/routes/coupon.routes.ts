import { Router } from 'express';
import 'express-async-errors';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from '../validators/coupon.validator';

const router = Router();

// Customer
router.post('/validate', authenticate, validate(validateCouponSchema), couponController.validateCoupon);

// Admin
router.get('/', authenticate, authorize('ADMIN'), couponController.getAllCoupons);
router.post('/', authenticate, authorize('ADMIN'), validate(createCouponSchema), couponController.createCoupon);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(updateCouponSchema), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize('ADMIN'), couponController.deleteCoupon);

export default router;
