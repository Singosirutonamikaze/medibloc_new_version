import { prisma } from './database';

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

/**
 * Gracefully disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    // Don't exit here, as this is cleanup
  }
};

/**
 * Health check for database
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};
