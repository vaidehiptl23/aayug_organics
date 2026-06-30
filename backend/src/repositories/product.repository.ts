import { Prisma, ProductStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { ProductFilters } from '../types';
import { getPaginationParams } from '../utils/helpers';

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
};

export class ProductRepository {
  async findAll(filters: ProductFilters) {
    const { skip, take, page, limit } = getPaginationParams(filters.page, filters.limit);

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(filters.status
        ? { status: filters.status as ProductStatus }
        : { status: 'ACTIVE' }),
      ...(filters.category && {
        category: { slug: filters.category },
      }),
      ...(filters.brand && { brand: { contains: filters.brand, mode: 'insensitive' } }),
      ...(filters.inStock === 'true' && { stockQuantity: { gt: 0 } }),
      ...((filters.minPrice || filters.maxPrice) && {
        price: {
          ...(filters.minPrice && { gte: parseFloat(filters.minPrice) }),
          ...(filters.maxPrice && { lte: parseFloat(filters.maxPrice) }),
        },
      }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { brand: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy = this.buildOrderBy(filters.sort);

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, skip, take, orderBy, include: productInclude }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  private buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc': return { price: 'asc' };
      case 'price_desc': return { price: 'desc' };
      case 'rating': return { avgRating: 'desc' };
      case 'popularity': return { totalReviews: 'desc' };
      case 'newest':
      default: return { createdAt: 'desc' };
    }
  }

  async findById(id: string) {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { ...productInclude, reviews: { where: { status: 'APPROVED' }, take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: { ...productInclude, reviews: { where: { status: 'APPROVED' }, take: 10, include: { user: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data, include: productInclude });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data, include: productInclude });
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
    });
  }

  async decrementStock(id: string, by: number) {
    return prisma.product.update({
      where: { id },
      data: { stockQuantity: { decrement: by } },
    });
  }

  async updateRating(productId: string) {
    const result = await prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: result._avg.rating ?? 0,
        totalReviews: result._count.rating,
      },
    });
  }

  async getLowStockProducts(threshold = 10) {
    return prisma.product.findMany({
      where: { stockQuantity: { lte: threshold }, deletedAt: null, status: 'ACTIVE' },
      select: { id: true, name: true, sku: true, stockQuantity: true },
    });
  }

  async countTotal() {
    return prisma.product.count({ where: { deletedAt: null } });
  }
}
