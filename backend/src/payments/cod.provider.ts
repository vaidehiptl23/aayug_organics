import { v4 as uuidv4 } from 'uuid';
import { PaymentProvider, PaymentInitiateResult, PaymentVerifyResult } from './payment.interface';

export class CodProvider implements PaymentProvider {
  async initiatePayment(
    orderId: string,
    amount: number,
    currency = 'INR',
  ): Promise<PaymentInitiateResult> {
    return {
      providerOrderId: `COD-${orderId}`,
      amount,
      currency,
      metadata: { paymentType: 'COD' },
    };
  }

  async verifyPayment(): Promise<PaymentVerifyResult> {
    // COD payments are automatically "verified" — collected at delivery
    return { isValid: true, providerPaymentId: `COD-${uuidv4()}` };
  }

  async initiateRefund(): Promise<{ refundId: string }> {
    return { refundId: `COD-REFUND-${uuidv4()}` };
  }

  async handleWebhook(): Promise<{ event: string }> {
    return { event: 'cod.noop' };
  }
}
