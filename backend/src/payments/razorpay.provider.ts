import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';
import { PaymentProvider, PaymentInitiateResult, PaymentVerifyResult } from './payment.interface';
import { AppError } from '../utils/appError';
import { StatusCodes } from 'http-status-codes';

export class RazorpayProvider implements PaymentProvider {
  private client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async initiatePayment(
    orderId: string,
    amount: number,
    currency = 'INR',
    customer: { name: string; email: string; phone?: string },
  ): Promise<PaymentInitiateResult> {
    const order = await this.client.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: orderId,
      notes: { orderId, customerName: customer.name, customerEmail: customer.email },
    });

    return {
      providerOrderId: order.id,
      amount,
      currency,
      key: env.RAZORPAY_KEY_ID,
      metadata: { order },
    };
  }

  async verifyPayment(
    providerOrderId: string,
    providerPaymentId: string,
    signature?: string,
  ): Promise<PaymentVerifyResult> {
    if (!signature) return { isValid: false };

    const body = `${providerOrderId}|${providerPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return {
      isValid: expectedSignature === signature,
      providerPaymentId,
    };
  }

  async initiateRefund(
    providerPaymentId: string,
    amount: number,
    reason = 'Order cancellation',
  ): Promise<{ refundId: string }> {
    const refund = await this.client.payments.refund(providerPaymentId, {
      amount: Math.round(amount * 100),
      notes: { reason },
    });
    return { refundId: refund.id };
  }

  async handleWebhook(
    payload: unknown,
    signature: string,
  ): Promise<{ event: string; orderId?: string }> {
    const body = JSON.stringify(payload);
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Invalid webhook signature', StatusCodes.BAD_REQUEST);
    }

    const event = (payload as { event: string; payload?: { order?: { entity?: { receipt?: string } } } });
    return {
      event: event.event,
      orderId: event.payload?.order?.entity?.receipt,
    };
  }
}
