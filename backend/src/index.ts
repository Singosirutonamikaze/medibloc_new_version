import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config/config";
import routes from "./routes/index.routes";
import {
  errorMiddleware as errorHandler,
  notFoundMiddleware as notFound,
} from "./middleware/error.middleware";
import { initializeDatabase, disconnectDatabase } from "./config/database-lifecycle";

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configurer Morgan pour écrire dans les logs
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`),
  { flags: 'a' }
);

const app: Application = express();

// Middleware
// Morgan - Logs toutes les requêtes HTTP
app.use(morgan(morganFormat, { stream: accessLogStream }));
app.use(morgan('dev')); // Aussi afficher dans la console

// Build safe CORS options from configuration
const buildCorsOptions = () => {
  const { origin, parsedOrigins, credentials } = config.cors as any;

  // If wildcard is used, do not send credentials (browsers disallow Access-Control-Allow-Origin: * with credentials)
  if (origin === "http://localhost:5173") {
    if (credentials) {
      console.warn(
        'CORS: origin="http://localhost:5173" and credentials=true is not supported by browsers. Credentials will be disabled.'
      );
    }
    return {
      origin: "http://localhost:5173",
      credentials: false,
    };
  }

  // Use a whitelist function for multiple or single origins
  const whitelist = Array.isArray(parsedOrigins) ? parsedOrigins : [origin];

  return {
    origin: (
      reqOrigin: unknown,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (like curl or server-to-server requests)
      if (!reqOrigin) return callback(null, true);
      if (whitelist.includes(reqOrigin as string)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: !!credentials,
  };
};

app.use(cors(buildCorsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const PORT = config.port;

const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(
        "---------------------------------------------------------------\n"
      );
      console.log(
        "-----------------------  Server Started  --------------------------\n"
      );
      console.log(
        `********   Server is running on port ${PORT} *********************\n`
      );
      console.log(
        `********   Environment: ${config.nodeEnv}  ***********************\n`
      );
      console.log(
        `********   API URL: http://localhost:${PORT}/api/v1  *********************\n`
      );
      console.log(
        `********   Health check: http://localhost:${PORT}/api/v1/health  *********************\n`
      );
      console.log(
        "\n---------------------------------------------------------------\n"
      );
    });

    // Store server reference for graceful shutdown
    return server;
  } catch (error) {
    console.error(" Failed to start server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
};

// Graceful shutdown
const setupGracefulShutdown = () => {
  const shutdown = async (signal: string) => {
    console.log(
      `\n-----------------------${signal}: Shutting down gracefully...--------------------------`
    );
    await disconnectDatabase();
    console.log("*************  Server stopped ******************");
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

// Start application
const start = async (): Promise<void> => {
  try {
    await startServer();
    setupGracefulShutdown();
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};

start();

export default app;
