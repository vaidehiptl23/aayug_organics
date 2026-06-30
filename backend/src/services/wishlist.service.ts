import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/appError';

export class WishlistService {
  async getWishlist(userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return wishlist?.items || [];
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });
    if (!product) throw new NotFoundError('Product');

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });
    if (existing) throw new ConflictError('Product already in wishlist');

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) throw new NotFoundError('Wishlist');

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    return this.getWishlist(userId);
  }
}
