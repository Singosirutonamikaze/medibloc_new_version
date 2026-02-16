import { defineConfig } from 'prisma/config';

const resolveDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || '';
  const password = process.env.PASSWORD || '';

  if (password && dbUrl.includes('PASSWORD')) {
    return dbUrl.replace('PASSWORD', password);
  }

  return dbUrl;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
