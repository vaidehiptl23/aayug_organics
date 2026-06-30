import slugify from 'slugify';
import crypto from 'crypto';

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `AYG-${timestamp}-${random}`;
}

export function generateSku(name: string, category: string): string {
  const nameCode = name.substring(0, 3).toUpperCase();
  const catCode = category.substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${catCode}-${nameCode}-${random}`;
}

export function sanitizeString(str: string): string {
  return str.replace(/[<>"'&]/g, (char) => {
    const escapeMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return escapeMap[char] || char;
  });
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.substring(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}

export function calculateDiscountPercentage(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export function getPaginationParams(
  page?: string | number,
  limit?: string | number,
  maxLimit = 100,
): { skip: number; take: number; page: number; limit: number } {
  const parsedPage = Math.max(1, parseInt(String(page || 1), 10));
  const parsedLimit = Math.min(Math.max(1, parseInt(String(limit || 20), 10)), maxLimit);
  return {
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit,
    page: parsedPage,
    limit: parsedLimit,
  };
}

export function omitFields<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9][0-9]{9}$/.test(phone);
}

export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}
