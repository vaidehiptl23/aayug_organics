import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  retryStrategy: (times) => {
    if (times > 5) {
      logger.error('Redis connection failed after 5 retries');
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product:${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => `category:${id}`,
  CART: (userId: string) => `cart:${userId}`,
  WISHLIST: (userId: string) => `wishlist:${userId}`,
  USER: (id: string) => `user:${id}`,
  DASHBOARD_STATS: 'dashboard:stats',
  TOP_PRODUCTS: 'dashboard:top_products',
};

export const CACHE_TTL = {
  SHORT: 60,          // 1 minute
  MEDIUM: 300,        // 5 minutes
  LONG: 1800,         // 30 minutes
  VERY_LONG: 86400,   // 24 hours
};

export async function connectRedis(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && env.REDIS_HOST === 'localhost') {
    logger.warn('⚠️  Redis connection skipped — running in production without external Redis host.');
    return;
  }
  await redis.connect();
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (redis.status !== 'ready') return null;
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttl?: number): Promise<void> {
  try {
    if (redis.status !== 'ready') return;
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  } catch {
    // noop
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    if (redis.status !== 'ready') return;
    await redis.del(key);
  } catch {
    // noop
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    if (redis.status !== 'ready') return;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // noop
  }
}
