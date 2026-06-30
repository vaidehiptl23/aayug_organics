import { PrismaClient } from '@prisma/client';
import { env } from './env';

// MySQL connection via Prisma
// DATABASE_URL format: mysql://USER:PASS@HOST:PORT/DB?ssl-mode=REQUIRED
// Works with Aiven (hosted), local MySQL, Railway MySQL, PlanetScale, etc.

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
