"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const resolveDatabaseUrl = () => {
    const dbUrl = process.env.DATABASE_URL || '';
    const password = process.env.PASSWORD || '';
    if (password && dbUrl.includes('PASSWORD')) {
        return dbUrl.replace('PASSWORD', password);
    }
    return dbUrl;
};
// Singleton pattern to avoid multiple PrismaClient instances
const globalForPrisma = globalThis;
const prismaClientSingleton = () => {
    const connectionString = resolveDatabaseUrl();
    const pool = new pg_1.Pool({ connectionString });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        errorFormat: 'pretty',
    });
};
exports.prisma = globalForPrisma.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
