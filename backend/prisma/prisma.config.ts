/**
 * @file prisma.config.ts
 * @description Configuration avancee Prisma CLI avec definition du schema et resolution dynamique de la source de donnees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { defineConfig } from 'prisma/config';

/**
 * @description Resout l'URL de connexion PostgreSQL sans instruction conditionnelle imperative.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Chaine de connexion resolue.
 */
const resolveDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || '';
  const password = process.env.PASSWORD || '';

  return password && dbUrl.includes('PASSWORD')
    ? dbUrl.replace('PASSWORD', password)
    : dbUrl;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
