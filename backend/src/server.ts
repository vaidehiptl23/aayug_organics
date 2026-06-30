import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, redis } from './config/redis';
import { prisma } from './config/database';
import { logger } from './utils/logger';
import bcrypt from 'bcryptjs';

const PORT = parseInt(process.env.PORT || String(env.PORT), 10);

// ─── Auto-seed if database is empty ───────────────────────────
async function autoSeedIfEmpty(): Promise<void> {
  try {
    const productCount = await prisma.product.count();
    if (productCount > 0) {
      logger.info(`✅ Database already has ${productCount} products — skipping seed`);
      return;
    }

    logger.info('🌱 No products found — running auto-seed...');

    // Admin user
    const adminPwd = await bcrypt.hash('Admin@123', 12);
    await prisma.user.upsert({
      where: { email: 'admin@aayugorganics.com' },
      update: {},
      create: { email: 'admin@aayugorganics.com', password: adminPwd, firstName: 'Admin', lastName: 'Aayug', role: 'ADMIN', isEmailVerified: true },
    });

    // Demo customer
    const custPwd = await bcrypt.hash('Customer@123', 12);
    await prisma.user.upsert({
      where: { email: 'rahul@example.com' },
      update: {},
      create: { email: 'rahul@example.com', password: custPwd, firstName: 'Rahul', lastName: 'Sharma', phone: '9876543210', role: 'CUSTOMER', isEmailVerified: true },
    });

    // Categories
    const cats = [
      { name: 'Salt',  slug: 'salt',  sortOrder: 1 },
      { name: 'Honey', slug: 'honey', sortOrder: 2 },
      { name: 'Hing',  slug: 'hing',  sortOrder: 3 },
      { name: 'Ghee',  slug: 'ghee',  sortOrder: 4 },
    ];
    const catMap: Record<string, string> = {};
    for (const c of cats) {
      const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
      catMap[c.slug] = cat.id;
    }

    // Products
    const products = [
      { name: 'Premium Himalayan Crystal Salt', slug: 'premium-himalayan-crystal-salt', sku: 'SAL-HIM-001', cat: 'salt',  price: 199,  stock: 100, badge: 'Bestseller' },
      { name: 'Raw Forest Honey',               slug: 'raw-forest-honey',               sku: 'HON-RAW-001', cat: 'honey', price: 549,  stock: 75,  badge: 'Organic'    },
      { name: 'Pure Hing (Asafoetida)',          slug: 'pure-hing-asafoetida',           sku: 'HNG-PUR-001', cat: 'hing',  price: 299,  stock: 60,  badge: 'New'        },
      { name: 'A2 Gir Cow Ghee',                slug: 'a2-gir-cow-ghee',                sku: 'GHE-A2G-001', cat: 'ghee',  price: 899,  stock: 50,  badge: 'Bestseller' },
    ];

    for (const p of products) {
      const product = await prisma.product.create({
        data: { name: p.name, slug: p.slug, sku: p.sku, categoryId: catMap[p.cat], price: p.price, stockQuantity: p.stock, badge: p.badge, status: 'ACTIVE', isFeatured: true },
      });
      await prisma.productImage.create({
        data: { productId: product.id, url: `https://placehold.co/600x600/1b4332/ffffff?text=${encodeURIComponent(p.name)}`, altText: p.name, isPrimary: true, sortOrder: 0 },
      });
    }

    // Coupons
    await prisma.coupon.upsert({ where: { code: 'ORGANIC10' }, update: {}, create: { code: 'ORGANIC10', type: 'PERCENTAGE', value: 10, minOrderAmount: 299, usageLimit: 1000, perUserLimit: 3, isActive: true } });
    await prisma.coupon.upsert({ where: { code: 'WELCOME50' }, update: {}, create: { code: 'WELCOME50', type: 'FIXED', value: 50, minOrderAmount: 299, usageLimit: 500, perUserLimit: 1, isActive: true } });

    logger.info('🎉 Auto-seed completed — 4 products ready!');
  } catch (err) {
    logger.error('Auto-seed failed:', err);
  }
}

async function startServer(): Promise<void> {
  try {
    // Start HTTP server FIRST so Railway healthcheck passes immediately
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://0.0.0.0:${PORT}`);
      logger.info(`📚 API Docs: http://0.0.0.0:${PORT}/api-docs`);
      logger.info(`❤️  Health:   http://0.0.0.0:${PORT}/api/v1/health`);
      logger.info(`🌿 Environment: ${env.NODE_ENV}`);
    });

    // Connect to PostgreSQL after server starts
    try {
      await connectDatabase();
      logger.info('✅ PostgreSQL connected');
      // Auto-seed products if database is empty
      await autoSeedIfEmpty();
    } catch (dbError) {
      logger.warn('⚠️  PostgreSQL connection failed — DB routes will return 503.');
      if (env.NODE_ENV === 'production') {
        logger.error('Database is required in production. Exiting.');
        process.exit(1);
      }
    }

    // Connect to Redis (always optional)
    try {
      await connectRedis();
    } catch {
      logger.warn('⚠️  Redis connection failed — caching disabled.');
    }

    // ─────────────────────────────────────────────
    // Graceful Shutdown
    // ─────────────────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received — shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        await redis.quit();
        logger.info('All connections closed. Exiting.');
        process.exit(0);
      });

      // Force exit after 10s if graceful shutdown fails
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
