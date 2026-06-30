import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { OrderFilters } from '../types';
import { getPaginationParams } from '../utils/helpers';

const orderInclude = {
  items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
  address: true,
  payment: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
};

export class OrderRepository {
  async findAll(filters: OrderFilters) {
    const { skip, take, page, limit } = getPaginationParams(filters.page, filters.limit);

    const where: Prisma.OrderWhereInput = {
      ...(filters.status && { status: filters.status as never }),
      ...(filters.userId && { userId: filters.userId }),
      ...((filters.startDate || filters.endDate) && {
        createdAt: {
          ...(filters.startDate && { gte: new Date(filters.startDate) }),
          ...(filters.endDate && { lte: new Date(filters.endDate) }),
        },
      }),
    };

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: orderInclude }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async findByUser(userId: string, filters: OrderFilters) {
    return this.findAll({ ...filters, userId });
  }

  async findById(id: string) {
    return prisma.order.findUnique({ where: { id }, include: orderInclude });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({ where: { orderNumber }, include: orderInclude });
  }

  async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({ data, include: orderInclude });
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    return prisma.order.update({ where: { id }, data, include: orderInclude });
  }

  async getRevenueStats(startDate?: Date, endDate?: Date) {
    return prisma.order.aggregate({
      where: {
        status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] },
        ...(startDate && endDate && { createdAt: { gte: startDate, lte: endDate } }),
      },
      _sum: { grandTotal: true },
      _count: { id: true },
    });
  }

  async getRecentOrders(limit = 5) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: true,
      },
    });
  }

  async getOrderCountByStatus() {
    return prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });
  }

  async getMonthlyRevenue(year: number) {
    return prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        SUM("grandTotal")::float AS revenue,
        COUNT(*)::int AS orders
      FROM orders
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
        AND status IN ('DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED')
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;
  }
}
