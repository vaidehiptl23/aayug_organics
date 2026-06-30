import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/apiResponse';
import { env } from '../config/env';
import { PaymentFactory } from '../payments/payment.factory';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const orderService = new OrderService();

export const checkout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await orderService.checkout(req.user!.userId, req.body);
  sendCreated(res, result, 'Order placed successfully');
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const order = await orderService.verifyPayment(req.user!.userId, req.body);
  sendSuccess(res, order, 'Payment verified');
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const filters = req.query as Record<string, string>;
  const result = await orderService.getUserOrders(req.user!.userId, filters);
  const meta = buildPaginationMeta(result.total, result.page, result.limit);
  sendSuccess(res, result.orders, 'Orders retrieved', 200, meta);
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const order = await orderService.getOrderById(req.params.id, req.user!.userId);
  sendSuccess(res, order);
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const order = await orderService.cancelOrder(req.params.id, req.user!.userId, req.body.reason);
  sendSuccess(res, order, 'Order cancelled');
};

// Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const filters = req.query as Record<string, string>;
  const result = await orderService.getAllOrders(filters);
  const meta = buildPaginationMeta(result.total, result.page, result.limit);
  sendSuccess(res, result.orders, 'Orders retrieved', 200, meta);
};

export const adminUpdateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const order = await orderService.adminUpdateOrderStatus(req.params.id, req.body);
  sendSuccess(res, order, 'Order status updated');
};

export const processRefund = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const order = await orderService.processRefund(req.params.id, req.body.amount);
  sendSuccess(res, order, 'Refund processed');
};

// Webhook handler
export const razorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const provider = PaymentFactory.getProvider('RAZORPAY');
    const { event, orderId } = await provider.handleWebhook(req.body, signature);

    logger.info(`Razorpay webhook: ${event} for order ${orderId}`);

    if (event === 'payment.captured' && orderId) {
      const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { payment: true },
      });
      if (order && order.payment?.status !== 'COMPLETED') {
        await prisma.$transaction([
          prisma.payment.update({ where: { id: order.payment!.id }, data: { status: 'COMPLETED' } }),
          prisma.order.update({ where: { id: orderId }, data: { status: 'CONFIRMED' } }),
        ]);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    logger.error('Webhook error:', err);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
};
