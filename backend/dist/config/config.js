"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'ERFSFGSdskfdgfgyerbfsuerezZTFrszhjczeghdkgzegdzalkarznsdgrazadhzdvzagf&',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    database: {
        url: process.env.DATABASE_URL || '',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },
};
