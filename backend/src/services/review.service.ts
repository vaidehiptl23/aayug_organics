import { prisma } from '../config/database';
import { ProductRepository } from '../repositories/product.repository';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../utils/appError';
import { getPaginationParams } from '../utils/helpers';

export class ReviewService {
  private productRepo = new ProductRepository();

  async createReview(
    userId: string,
    productId: string,
    data: { rating: number; title?: string; body?: string },
  ) {
    const product = await prisma.product.findFirst({ where: { id: productId, deletedAt: null } });
    if (!product) throw new NotFoundError('Product');

    const existing = await prisma.review.findFirst({ where: { userId, productId } });
    if (existing) throw new ConflictError('You have already reviewed this product');

    // Check if verified buyer
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: { in: ['DELIVERED', 'CONFIRMED'] } },
      },
    });

    const review = await prisma.review.create({
      data: {
        ...data,
        userId,
        productId,
        isVerifiedBuyer: !!hasPurchased,
        status: 'PENDING',
      },
      include: {
        user: { select: { firstName: true, lastName: true, profileImage: true } },
      },
    });

    return review;
  }

  async updateReview(userId: string, reviewId: string, data: { rating?: number; title?: string; body?: string }) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundError('Review');
    if (review.userId !== userId) throw new ForbiddenError();

    return prisma.review.update({ where: { id: reviewId }, data });
  }

  async deleteReview(userId: string, reviewId: string, isAdmin = false) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundError('Review');
    if (!isAdmin && review.userId !== userId) throw new ForbiddenError();

    await prisma.review.delete({ where: { id: reviewId } });
    await this.productRepo.updateRating(review.productId);
  }

  async getProductReviews(productId: string, page?: string, limit?: string) {
    const { skip, take } = getPaginationParams(page, limit);
    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where: { productId, status: 'APPROVED' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, profileImage: true } } },
      }),
      prisma.review.count({ where: { productId, status: 'APPROVED' } }),
    ]);
    return { reviews, total };
  }

  async moderateReview(reviewId: string, status: 'APPROVED' | 'REJECTED') {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundError('Review');

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    if (status === 'APPROVED') {
      await this.productRepo.updateRating(review.productId);
    }

    return updated;
  }

  async getPendingReviews(page?: string, limit?: string) {
    const { skip, take } = getPaginationParams(page, limit);
    return prisma.review.findMany({
      where: { status: 'PENDING' },
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
        product: { select: { name: true } },
      },
    });
  }
}
