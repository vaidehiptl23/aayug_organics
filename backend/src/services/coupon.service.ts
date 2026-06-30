import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/appError';
import { getPaginationParams } from '../utils/helpers';

export class CouponService {
  async validateCoupon(code: string, userId: string, cartTotal: number) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    });
    if (!coupon) throw new NotFoundError('Coupon');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestError('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestError('Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestError(`Minimum order amount of ₹${coupon.minOrderAmount} required`);
    }
    if (coupon.applicableUserId && coupon.applicableUserId !== userId) {
      throw new BadRequestError('This coupon is not applicable for your account');
    }

    const userUsage = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });
    if (userUsage >= coupon.perUserLimit) {
      throw new BadRequestError('You have already used this coupon');
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (cartTotal * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discountAmount = Number(coupon.value);
    }

    discountAmount = Math.min(discountAmount, cartTotal);

    return { coupon, discountAmount: parseFloat(discountAmount.toFixed(2)) };
  }

  async getAllCoupons(page?: string, limit?: string) {
    const { skip, take } = getPaginationParams(page, limit);
    const [coupons, total] = await prisma.$transaction([
      prisma.coupon.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.coupon.count(),
    ]);
    return { coupons, total };
  }

  async createCoupon(data: {
    code: string; type: 'PERCENTAGE' | 'FIXED'; value: number;
    minOrderAmount?: number; maxDiscountAmount?: number; usageLimit?: number;
    perUserLimit?: number; isActive?: boolean; expiresAt?: string;
    applicableUserId?: string;
  }) {
    const existing = await prisma.coupon.findFirst({ where: { code: data.code } });
    if (existing) throw new BadRequestError('Coupon code already exists');

    return prisma.coupon.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async updateCoupon(id: string, data: Partial<{
    value: number; minOrderAmount: number; maxDiscountAmount: number;
    usageLimit: number; perUserLimit: number; isActive: boolean; expiresAt: string;
  }>) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundError('Coupon');

    return prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async deleteCoupon(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundError('Coupon');
    await prisma.coupon.delete({ where: { id } });
  }
}
