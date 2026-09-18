/**
 * @file prisma.config.ts
 * @description Configuration principale du moteur Prisma et resolution dynamique de l'URL de connexion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import * as dotenv from 'dotenv';

dotenv.config();

/**
 * @description Resout l'URL finale de connexion a PostgreSQL sans instruction conditionnelle imperative.
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

export default {
  datasource: {
    url: resolveDatabaseUrl(),
  },
};
