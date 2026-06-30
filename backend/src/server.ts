import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    // Connect to PostgreSQL (non-fatal in dev — shows clear message if not available)
    try {
      await connectDatabase();
      logger.info('✅ PostgreSQL connected');
    } catch (dbError) {
      logger.warn('⚠️  PostgreSQL connection failed — API routes requiring DB will return 503.');
      logger.warn('   Set DATABASE_URL in backend/.env to a running PostgreSQL instance.');
      logger.warn('   Quick start: docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16-alpine');
      if (env.NODE_ENV === 'production') {
        logger.error('Database is required in production. Exiting.');
        process.exit(1);
      }
    }

    // Connect to Redis (always optional)
    try {
      await connectRedis();
    } catch (redisError) {
      logger.warn('⚠️  Redis connection failed — caching disabled.');
    }

    // Start HTTP server regardless (health check will still work)
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`❤️  Health:   http://localhost:${PORT}/api/v1/health`);
      logger.info(`🌿 Environment: ${env.NODE_ENV}`);
    });

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
