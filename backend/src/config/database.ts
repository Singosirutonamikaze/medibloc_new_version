import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const resolveDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || '';
  const password = process.env.PASSWORD || '';

  if (password && dbUrl.includes('PASSWORD')) {
    return dbUrl.replace('PASSWORD', password);
  }

  return dbUrl;
};

// Singleton pattern to avoid multiple PrismaClient instances
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  const connectionString = resolveDatabaseUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty',
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
