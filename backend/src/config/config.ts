import dotenv from 'dotenv';

dotenv.config();

// Construct DATABASE_URL with PASSWORD from environment
const getDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || '';
  const password = process.env.PASSWORD || '';

  if (password && dbUrl.includes('PASSWORD')) {
    return dbUrl.replace('PASSWORD', password);
  }

  return dbUrl;
};

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsParsedOrigins = corsOrigin === '*'
  ? ['*']
  : corsOrigin.split(',').map((value) => value.trim()).filter(Boolean);

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET environment variable is required for security. Please set it in your .env file.');
      }
      // Fallback sécurisé pour les environnements dev/test — jamais utilisé en production
      return 'medibloc-insecure-fallback-not-for-production';
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  database: {
    url: getDatabaseUrl(),
  },

  cors: {
    // SECURITY: CORS_ORIGIN can be:
    // - '*' to allow all origins (DEVELOPMENT ONLY - browser disables credentials automatically)
    // - a single origin string (https://example.com)
    // - a comma-separated list of origins (https://a.com,https://b.com)
    // WARNING: Using '*' in production allows any domain to access your API and is a security risk
    origin: corsOrigin,
    // parsedOrigins is derived from origin and is an array when origin is a list
    parsedOrigins: corsParsedOrigins,
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};
