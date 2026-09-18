/**
 * @file database.config.ts
 * @description Instanciation et initialisation du singleton Prisma Client avec adaptateur PostgreSQL.
 * Assure la continuite et la reutilisation de la connexion a la base de donnees relationnelle.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * @description Resout l'URL finale de la base de donnees a partir des variables d'environnement.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Chaine de connexion securisee pour PostgreSQL.
 */
const resolveDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || "";
  const password = process.env.PASSWORD || "";

  return password && dbUrl.includes("PASSWORD")
    ? dbUrl.replace("PASSWORD", password)
    : dbUrl;
};

const globalForPrisma = globalThis as { prisma?: PrismaClient };

/**
 * @description Instancie un nouveau client Prisma avec pool de connexions PostgreSQL.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Instance configuree de {@link PrismaClient}.
 */
const prismaClientSingleton = (): PrismaClient => {
  const connectionString = resolveDatabaseUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });
};

export const prisma: PrismaClient =
  globalForPrisma.prisma || prismaClientSingleton();

export default prisma;
