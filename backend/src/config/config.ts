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
    origin: corsOrigin,
    // parsedOrigins is derived from origin and is an array when origin is a list
    parsedOrigins: corsParsedOrigins,
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};
