import { PrismaClient } from '@prisma/client';

// Set DATABASE_URL with PASSWORD before initializing Prisma
if (process.env.DATABASE_URL?.includes('PASSWORD') && process.env.PASSWORD) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('PASSWORD', process.env.PASSWORD);
}

// Singleton pattern to avoid multiple PrismaClient instances
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty',
  });

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
