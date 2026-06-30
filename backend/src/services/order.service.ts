import { prisma } from '../config/database';
import { CartRepository } from '../repositories/cart.repository';
import { OrderRepository } from '../repositories/order.repository';
import { CouponService } from './coupon.service';
import { CartService } from './cart.service';
import { PaymentFactory, ProviderName } from '../payments/payment.factory';
import { mailer } from '../emails/mailer';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/appError';
import { generateOrderNumber } from '../utils/helpers';
import { CheckoutPayload, OrderFilters } from '../types';

export class OrderService {
  private orderRepo = new OrderRepository();
  private cartRepo = new CartRepository();
  private cartService = new CartService();
  private couponService = new CouponService();

  async checkout(userId: string, payload: CheckoutPayload) {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) throw new BadRequestError('Cart is empty');

    const address = await prisma.address.findFirst({
      where: { id: payload.addressId, userId },
    });
    if (!address) throw new NotFoundError('Address');

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${item.product.name}". Only ${item.product.stockQuantity} available.`,
        );
      }
    }

    const cartItems = cart.items.map((item) => ({
      price: Number(item.product.discountPrice ?? item.product.price),
      quantity: item.quantity,
    }));

    // Validate coupon if provided
    let discountAmount = 0;
    let couponId: string | undefined;
    let couponCode: string | undefined;

    if (payload.couponCode) {
      const { coupon, discountAmount: disc } = await this.couponService.validateCoupon(
        payload.couponCode,
        userId,
        cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
      );
      discountAmount = disc;
      couponId = coupon.id;
      couponCode = coupon.code;
    }

    const totals = this.cartService.calculateTotals(cartItems, discountAmount);

    const orderNumber = generateOrderNumber();
    const provider = (payload.paymentProvider || (payload.paymentMethod === 'COD' ? 'COD' : 'RAZORPAY')) as ProviderName;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: payload.addressId,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          shippingCharge: totals.shippingCharge,
          taxAmount: totals.taxAmount,
          grandTotal: totals.grandTotal,
          couponId,
          couponCode,
          notes: payload.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productSku: item.product.sku,
              quantity: item.quantity,
              unitPrice: Number(item.product.discountPrice ?? item.product.price),
              totalPrice: Number(item.product.discountPrice ?? item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: true,
          address: true,
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        },
      });

      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -item.quantity,
            reason: `Order ${orderNumber}`,
            balanceAfter: item.product.stockQuantity - item.quantity,
          },
        });
      }

      // Record coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
        await tx.couponUsage.create({ data: { couponId, userId, orderId: newOrder.id } });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // Initiate payment
    const paymentProvider = PaymentFactory.getProvider(provider);
    const fullName = `${order.user.firstName} ${order.user.lastName}`;
    const paymentResult = await paymentProvider.initiatePayment(
      order.id,
      totals.grandTotal,
      'INR',
      { name: fullName, email: order.user.email, phone: order.user.phone || '' },
    );

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: provider === 'COD' ? 'COD' : 'RAZORPAY',
        method: payload.paymentMethod as 'UPI' | 'CARD' | 'COD' | 'RAZORPAY' | 'PAYU' | 'CASHFREE',
        amount: totals.grandTotal,
        providerOrderId: paymentResult.providerOrderId,
        status: provider === 'COD' ? 'PENDING' : 'PENDING',
      },
    });

    // Send order confirmation email
    await mailer.sendOrderConfirmationEmail(
      order.user.email,
      order.user.firstName,
      orderNumber,
      totals.grandTotal,
    );

    await prisma.notification.create({
      data: {
        userId,
        type: 'ORDER_PLACED',
        title: 'Order Placed Successfully',
        message: `Your order ${orderNumber} has been placed. Total: ₹${totals.grandTotal}`,
        metadata: { orderId: order.id, orderNumber },
      },
    });

    return {
      order,
      payment: paymentResult,
      provider,
    };
  }

  async verifyPayment(userId: string, payload: {
    orderId: string;
    providerOrderId: string;
    providerPaymentId: string;
    providerSignature?: string;
  }) {
    const order = await this.orderRepo.findById(payload.orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId !== userId) throw new ForbiddenError();

    const payment = order.payment;
    if (!payment) throw new BadRequestError('No payment record found');

    const provider = PaymentFactory.getProvider(payment.provider as ProviderName);
    const result = await provider.verifyPayment(
      payload.providerOrderId,
      payload.providerPaymentId,
      payload.providerSignature,
    );

    if (!result.isValid) throw new BadRequestError('Payment verification failed');

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          providerPaymentId: payload.providerPaymentId,
          providerSignature: payload.providerSignature,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
      }),
      prisma.transaction.create({
        data: {
          userId,
          orderId: order.id,
          type: 'PAYMENT',
          amount: payment.amount,
          status: 'COMPLETED',
          description: `Payment for order ${order.orderNumber}`,
        },
      }),
    ]);

    return this.orderRepo.findById(order.id);
  }

  async getUserOrders(userId: string, filters: OrderFilters) {
    return this.orderRepo.findByUser(userId, filters);
  }

  async getOrderById(id: string, userId?: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundError('Order');
    if (userId && order.userId !== userId) throw new ForbiddenError();
    return order;
  }

  async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId !== userId) throw new ForbiddenError();
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestError('Order cannot be cancelled at this stage');
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', cancelledAt: new Date(), cancellationReason: reason },
      });
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            change: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
            balanceAfter: 0, // will be recalculated
          },
        });
      }
      // Revoke coupon usage
      if (order.couponId) {
        await tx.coupon.update({
          where: { id: order.couponId },
          data: { usageCount: { decrement: 1 } },
        });
      }
    });

    return this.orderRepo.findById(orderId);
  }

  // Admin
  async getAllOrders(filters: OrderFilters) {
    return this.orderRepo.findAll(filters);
  }

  async adminUpdateOrderStatus(orderId: string, data: {
    status: string; trackingNumber?: string; cancellationReason?: string;
  }) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    const updateData: Record<string, unknown> = { status: data.status };
    if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber;
    if (data.status === 'SHIPPED') updateData.shippedAt = new Date();
    if (data.status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (data.status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = data.cancellationReason;
    }

    if (data.trackingNumber && data.status === 'SHIPPED') {
      await mailer.sendShippingUpdateEmail(
        order.user.email,
        order.user.firstName,
        order.orderNumber,
        data.trackingNumber,
      );
    }

    return this.orderRepo.update(orderId, updateData);
  }

  async processRefund(orderId: string, amount?: number) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    const payment = order.payment;
    if (!payment?.providerPaymentId) throw new BadRequestError('No payment to refund');

    const refundAmount = amount || Number(order.grandTotal);
    const provider = PaymentFactory.getProvider(payment.provider as ProviderName);
    const { refundId } = await provider.initiateRefund(
      payment.providerPaymentId,
      refundAmount,
      'Customer requested refund',
    );

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
          refundId,
          refundAmount,
        },
      }),
      prisma.order.update({ where: { id: orderId }, data: { status: 'REFUNDED' } }),
      prisma.transaction.create({
        data: {
          userId: order.userId,
          orderId,
          type: 'REFUND',
          amount: refundAmount,
          status: 'COMPLETED',
          description: `Refund for order ${order.orderNumber}`,
        },
      }),
    ]);

    return this.orderRepo.findById(orderId);
  }
}
