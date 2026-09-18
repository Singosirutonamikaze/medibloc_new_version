/**
 * @file env.config.ts
 * @description Module de chargement et de validation centralisee des variables d'environnement.
 * Fournit les constantes de configuration du serveur HTTP, de la base de donnees et des jetons JWT.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * @description Construit l'URL de connexion PostgreSQL en injectant le mot de passe si specifie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 * @returns Chaine de connexion formattee pour le client Prisma.
 */
const getDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || "";
  const password = process.env.PASSWORD || "";

  return password && dbUrl.includes("PASSWORD")
    ? dbUrl.replace("PASSWORD", password)
    : dbUrl;
};

const defaultOrigins = [
  "http://localhost:5173",
  "https://studio.apollographql.com",
  "https://sandbox.apollo.dev",
];

const corsOrigin = process.env.CORS_ORIGIN || defaultOrigins.join(",");
const corsParsedOrigins =
  corsOrigin === "*"
    ? ["*"]
    : corsOrigin
        .split(",")
        .map((value: string): string => value.trim())
        .concat(defaultOrigins)
        .filter((val, index, self) => Boolean(val) && self.indexOf(val) === index);


/**
 * @interface AppConfig
 * @description Structure globale des variables de configuration de l'application.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property port Port TCP d'ecoute du serveur HTTP Express.
 * @property nodeEnv Environnement d'execution ({@code "development"}, {@code "production"}, {@code "test"}).
 * @property jwt Parametres de signature des jetons de securite JWT.
 * @property database Configuration de persistance PostgreSQL.
 * @property cors Parametres de filtrage cross-origin.
 */
export interface AppConfig {
  readonly port: number | string;
  readonly nodeEnv: string;
  readonly jwt: {
    readonly secret: string;
    readonly expiresIn: string;
  };
  readonly database: {
    readonly url: string;
  };
  readonly cors: {
    readonly origin: string;
    readonly parsedOrigins: string[];
    readonly credentials: boolean;
  };
}

export const config: AppConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "e52cee36b80703736f458daf3605d8293e8bee2103e4866c48ba33df0d827708",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  database: {
    url: getDatabaseUrl(),
  },
  cors: {
    origin: corsOrigin,
    parsedOrigins: corsParsedOrigins,
    credentials: process.env.CORS_CREDENTIALS === "true",
  },
};

export default config;
