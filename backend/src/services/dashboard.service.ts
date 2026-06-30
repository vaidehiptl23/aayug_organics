import { prisma } from '../config/database';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { UserRepository } from '../repositories/user.repository';
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from '../config/redis';

export class DashboardService {
  private orderRepo = new OrderRepository();
  private productRepo = new ProductRepository();
  private userRepo = new UserRepository();

  async getStats(startDate?: string, endDate?: string) {
    const cacheKey = startDate ? `${CACHE_KEYS.DASHBOARD_STATS}:${startDate}:${endDate}` : CACHE_KEYS.DASHBOARD_STATS;
    const cached = await getCache(cacheKey);
    if (cached && !startDate) return cached;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const [revenue, totalCustomers, totalProducts, ordersByStatus, recentOrders, topProducts, monthlyRevenue] =
      await Promise.all([
        this.orderRepo.getRevenueStats(start, end),
        this.userRepo.countTotal(),
        this.productRepo.countTotal(),
        this.orderRepo.getOrderCountByStatus(),
        this.orderRepo.getRecentOrders(5),
        this.getTopProducts(),
        this.orderRepo.getMonthlyRevenue(new Date().getFullYear()),
      ]);

    const pendingOrders = ordersByStatus.find((o) => o.status === 'PENDING')?._count.status ?? 0;

    const stats = {
      totalOrders: revenue._count.id,
      totalRevenue: Number(revenue._sum.grandTotal ?? 0),
      totalCustomers,
      totalProducts,
      pendingOrders,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count.status })),
      recentOrders,
      topProducts,
      revenueByMonth: monthlyRevenue,
    };

    if (!startDate) await setCache(cacheKey, stats, CACHE_TTL.SHORT);
    return stats;
  }

  async getTopProducts(limit = 5) {
    const cached = await getCache(CACHE_KEYS.TOP_PRODUCTS);
    if (cached) return cached;

    const topItems = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const result = await Promise.all(
      topItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        });
        return {
          productId: item.productId,
          productName: item.productName,
          totalSold: item._sum.quantity ?? 0,
          totalRevenue: Number(item._sum.totalPrice ?? 0),
          product,
        };
      }),
    );

    await setCache(CACHE_KEYS.TOP_PRODUCTS, result, CACHE_TTL.MEDIUM);
    return result;
  }

  async getSalesReport(startDate: string, endDate: string) {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
        status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] },
      },
      include: { items: true, user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = orders.reduce((s, o) => s + Number(o.grandTotal), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { orders, totalRevenue, totalOrders, avgOrderValue };
  }

  async getInventoryReport() {
    const [lowStock, outOfStock, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: { stockQuantity: { lte: 10, gt: 0 }, deletedAt: null },
        select: { id: true, name: true, sku: true, stockQuantity: true, category: { select: { name: true } } },
      }),
      prisma.product.count({ where: { status: 'OUT_OF_STOCK', deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
    ]);

    return { lowStock, outOfStockCount: outOfStock, totalProducts };
  }
}
