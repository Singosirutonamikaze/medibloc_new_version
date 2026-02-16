"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.disconnectDatabase = exports.initializeDatabase = void 0;
const database_1 = require("./database");
/**
 * Initialize database connection
 */
const initializeDatabase = async () => {
    try {
        // Test connection
        await database_1.prisma.$queryRaw `SELECT 1`;
        console.log('Database connection established');
    }
    catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
/**
 * Gracefully disconnect from database
 */
const disconnectDatabase = async () => {
    try {
        await database_1.prisma.$disconnect();
        console.log('Database disconnected');
    }
    catch (error) {
        console.error('Error disconnecting from database:', error);
        // Don't exit here, as this is cleanup
    }
};
exports.disconnectDatabase = disconnectDatabase;
/**
 * Health check for database
 */
const checkDatabaseHealth = async () => {
    try {
        await database_1.prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
