export interface PaymentInitiateResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  key?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerifyResult {
  isValid: boolean;
  providerPaymentId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentProvider {
  initiatePayment(
    orderId: string,
    amount: number,
    currency: string,
    customer: { name: string; email: string; phone?: string },
  ): Promise<PaymentInitiateResult>;

  verifyPayment(
    providerOrderId: string,
    providerPaymentId: string,
    signature?: string,
  ): Promise<PaymentVerifyResult>;

  initiateRefund(
    providerPaymentId: string,
    amount: number,
    reason?: string,
  ): Promise<{ refundId: string }>;

  handleWebhook(payload: unknown, signature: string): Promise<{ event: string; orderId?: string }>;
}
