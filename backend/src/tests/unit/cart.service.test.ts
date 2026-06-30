import { CartService } from '../../services/cart.service';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  describe('calculateTotals', () => {
    it('should calculate totals with free shipping above threshold', () => {
      const items = [
        { price: 699, quantity: 2 }, // 1398
      ];
      const totals = cartService.calculateTotals(items, 0);

      expect(totals.subtotal).toBe(1398);
      expect(totals.shippingCharge).toBe(0); // >= 999
      expect(totals.discountAmount).toBe(0);
      expect(totals.grandTotal).toBeGreaterThan(0);
    });

    it('should add shipping charge below threshold', () => {
      const items = [{ price: 249, quantity: 1 }];
      const totals = cartService.calculateTotals(items, 0);

      expect(totals.subtotal).toBe(249);
      expect(totals.shippingCharge).toBe(99);
    });

    it('should apply discount correctly', () => {
      const items = [{ price: 699, quantity: 1 }];
      const discountAmount = 69.9; // 10%
      const totals = cartService.calculateTotals(items, discountAmount);

      expect(totals.discountAmount).toBe(69.9);
      expect(totals.subtotal).toBe(699);
    });

    it('should calculate tax correctly', () => {
      const items = [{ price: 1000, quantity: 1 }];
      const totals = cartService.calculateTotals(items, 0);

      // tax = 1000 * 0.18 = 180
      expect(totals.taxAmount).toBe(180);
    });

    it('should handle empty cart', () => {
      const totals = cartService.calculateTotals([]);
      expect(totals.subtotal).toBe(0);
      expect(totals.grandTotal).toBe(0);
    });
  });
});
