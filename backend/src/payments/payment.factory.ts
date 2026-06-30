import { PaymentProvider } from './payment.interface';
import { RazorpayProvider } from './razorpay.provider';
import { CodProvider } from './cod.provider';

export type ProviderName = 'RAZORPAY' | 'PAYU' | 'CASHFREE' | 'COD';

export class PaymentFactory {
  private static providers: Map<ProviderName, PaymentProvider> = new Map();

  static getProvider(name: ProviderName): PaymentProvider {
    if (!this.providers.has(name)) {
      switch (name) {
        case 'RAZORPAY':
          this.providers.set(name, new RazorpayProvider());
          break;
        case 'COD':
          this.providers.set(name, new CodProvider());
          break;
        default:
          throw new Error(`Payment provider "${name}" is not implemented`);
      }
    }
    return this.providers.get(name)!;
  }
}
