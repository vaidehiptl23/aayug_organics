import { Router } from 'express';
import 'express-async-errors';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { checkoutSchema, verifyPaymentSchema, updateOrderStatusSchema, cancelOrderSchema } from '../validators/order.validator';

const router = Router();

// Webhook (no auth needed — verified by signature)
router.post('/webhooks/razorpay', orderController.razorpayWebhook);

// Customer routes
router.post('/checkout', authenticate, validate(checkoutSchema), orderController.checkout);
router.post('/verify-payment', authenticate, validate(verifyPaymentSchema), orderController.verifyPayment);
router.get('/my-orders', authenticate, orderController.getUserOrders);
router.get('/my-orders/:id', authenticate, orderController.getOrderById);
router.patch('/my-orders/:id/cancel', authenticate, validate(cancelOrderSchema), orderController.cancelOrder);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), orderController.getAllOrders);
router.patch('/:id/status', authenticate, authorize('ADMIN'), validate(updateOrderStatusSchema), orderController.adminUpdateOrderStatus);
router.post('/:id/refund', authenticate, authorize('ADMIN'), orderController.processRefund);

export default router;
