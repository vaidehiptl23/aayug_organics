import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = parseInt(process.env.PORT || String(env.PORT), 10);

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
