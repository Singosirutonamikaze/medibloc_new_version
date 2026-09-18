/**
 * @file index.ts
 * @description Point d'entree principal et initialisation du serveur HTTP Express et GraphQL Apollo.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { config } from "../core/configs/env/env.config";
import {
  initializeDatabase,
  disconnectDatabase,
} from "../core/configs/database/database-lifecycle.config";
import { swaggerSpec } from "../core/configs/swagger/swagger.config";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "../core/middlewares/errors/error.middleware";
import apiRoutes from "../routes/app/index.routes";
import {
  createApolloServer,
  createGraphQLMiddleware,
} from "../graphql/servers/apollo.server";

// Creation du dossier de journaux s'il n'existe pas
const logsDir = path.join(process.cwd(), "logs");
const logsDirExists = fs.existsSync(logsDir);
const createLogsDirMap: Record<string, () => void> = {
  false: () => fs.mkdirSync(logsDir, { recursive: true }),
  true: () => undefined,
};
createLogsDirMap[String(logsDirExists)]();

const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, `access-${new Date().toISOString().split("T")[0]}.log`),
  { flags: "a" }
);

const app: Application = express();

// Journalisation HTTP
app.use(morgan(morganFormat, { stream: accessLogStream }));
app.use(morgan("dev"));

/**
 * @description Construit les options de configuration CORS de maniere declarative.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Options de configuration pour le middleware cors.
 */
const buildCorsOptions = () => {
  const { origin, parsedOrigins, credentials } = config.cors;
  const isWildcard = origin === "*";

  const wildcardOptions = {
    origin: "*",
    credentials: false,
  };

  const whitelist = parsedOrigins.length > 0 ? parsedOrigins : [origin];
  const whitelistOptions = {
    origin: (
      reqOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      const isAllowed = !reqOrigin || whitelist.includes(reqOrigin) || whitelist.includes("*");
      const corsHandlers: Record<string, () => void> = {
        true: () => callback(null, true),
        false: () => callback(null, false),
      };
      corsHandlers[String(isAllowed)]();
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Apollo-Require-Preflight",
      "X-Requested-With",
    ],
    credentials,
  };

  const corsStrategies: Record<
    string,
    () => typeof wildcardOptions | typeof whitelistOptions
  > = {
    wildcard: () => wildcardOptions,
    whitelist: () => whitelistOptions,
  };

  const key = isWildcard ? "wildcard" : "whitelist";
  return corsStrategies[key]();
};

app.use(cors(buildCorsOptions()));
app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(express.text({ type: "application/graphql" }));
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger OpenAPI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fichiers statiques et televersements
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes d'API REST
app.use("/api/v1", apiRoutes);

// Serviteur Apollo GraphQL
const apolloServer = createApolloServer();
app.use("/graphql", createGraphQLMiddleware(apolloServer));

// Gestion des erreurs (placee apres toutes les routes et GraphQL)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = config.port;

/**
 * @description Initialise la base de donnees, demarre le serveur GraphQL et demarre l'ecoute HTTP.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @returns Promesse du serveur HTTP instancie.
 */
const startServer = async () => {
  await initializeDatabase();

  return app.listen(PORT, () => {
    console.log(`Serveur demarre sur le port ${PORT} [Env: ${config.nodeEnv}]`);
    console.log(`API REST : http://localhost:${PORT}/api/v1`);
    console.log(`GraphQL  : http://localhost:${PORT}/graphql`);
    console.log(`Swagger  : http://localhost:${PORT}/api-docs`);
  });
};

/**
 * @description Enregistre les gestionnaires d'arret gracieux pour liberer les connexions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
const setupGracefulShutdown = (): void => {
  const shutdown = async (signal: string) => {
    console.log(
      `Reception du signal ${signal}, fermeture propre des ressources...`
    );
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

/**
 * @description Bootstrap general et demarrage global de l'application MediBloc.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const start = async (): Promise<void> => {
  try {
    await startServer();
    setupGracefulShutdown();
  } catch (error) {
    console.error("Echec de l'initialisation du serveur :", error);
    process.exit(1);
  }
};

start();

export default app;
