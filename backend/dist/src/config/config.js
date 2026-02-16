"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Construct DATABASE_URL with PASSWORD from environment
const getDatabaseUrl = () => {
    const dbUrl = process.env.DATABASE_URL || '';
    const password = process.env.PASSWORD || '';
    if (password && dbUrl.includes('PASSWORD')) {
        return dbUrl.replace('PASSWORD', password);
    }
    return dbUrl;
};
exports.config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'ERFSFGSdskfdgfgyerbfsuerezZTFrszhjczeghdkgzegdzalkarznsdgrazadhzdvzagf&',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    database: {
        url: getDatabaseUrl(),
    },
    cors: {
        // CORS_ORIGIN can be:
        // - '*' to allow all origins (credentials will be disabled in that case)
        // - a single origin string (https://example.com)
        // - a comma-separated list of origins (https://a.com,https://b.com)
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        // parsedOrigins is derived from origin and is an array when origin is a list
        parsedOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : ['http://localhost:5173'],
        credentials: process.env.CORS_CREDENTIALS === 'true' || true,
    },
};
