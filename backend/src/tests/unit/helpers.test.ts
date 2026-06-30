import {
  createSlug,
  generateOrderNumber,
  sanitizeString,
  maskEmail,
  calculateDiscountPercentage,
  getPaginationParams,
  isValidIndianPhone,
  isValidIndianPincode,
} from '../../utils/helpers';

describe('Helper Utilities', () => {
  describe('createSlug', () => {
    it('should create a slug from a name', () => {
      expect(createSlug('A2 Gir Cow Ghee')).toBe('a2-gir-cow-ghee');
    });
    it('should handle special characters', () => {
      expect(createSlug('Cold-Pressed Coconut Oil!')).toBe('cold-pressed-coconut-oil');
    });
  });

  describe('generateOrderNumber', () => {
    it('should generate a unique order number', () => {
      const n1 = generateOrderNumber();
      const n2 = generateOrderNumber();
      expect(n1).toMatch(/^AYG-/);
      expect(n1).not.toBe(n2);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).not.toContain('<script>');
    });
  });

  describe('maskEmail', () => {
    it('should mask email address', () => {
      expect(maskEmail('rahul@example.com')).toBe('ra***@example.com');
    });
  });

  describe('calculateDiscountPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateDiscountPercentage(299, 249)).toBe(17);
    });
    it('should return 0 for invalid input', () => {
      expect(calculateDiscountPercentage(0, 249)).toBe(0);
    });
  });

  describe('getPaginationParams', () => {
    it('should return defaults', () => {
      const params = getPaginationParams();
      expect(params.page).toBe(1);
      expect(params.limit).toBe(20);
      expect(params.skip).toBe(0);
    });
    it('should calculate correct skip', () => {
      const params = getPaginationParams(3, 10);
      expect(params.skip).toBe(20);
    });
    it('should cap limit at maxLimit', () => {
      const params = getPaginationParams(1, 500, 100);
      expect(params.limit).toBe(100);
    });
  });

  describe('isValidIndianPhone', () => {
    it('should validate correct Indian phone', () => {
      expect(isValidIndianPhone('9876543210')).toBe(true);
    });
    it('should reject invalid phone', () => {
      expect(isValidIndianPhone('1234567890')).toBe(false);
    });
  });

  describe('isValidIndianPincode', () => {
    it('should validate correct pincode', () => {
      expect(isValidIndianPincode('380001')).toBe(true);
    });
    it('should reject invalid pincode', () => {
      expect(isValidIndianPincode('000000')).toBe(false);
    });
  });
});
