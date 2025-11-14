import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/config";
import routes from "./routes/index.routes";
import {
  errorMiddleware as errorHandler,
  notFoundMiddleware as notFound,
} from "./middleware/error.middleware";
import prisma from "./config/database";

const app: Application = express();

// Middleware
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
      if (whitelist.indexOf(reqOrigin) !== -1) {
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
    await prisma.$connect();

    console.log(
      "\n$$$$$$$$$$$$$$$$$$$$$ Database connected successfully $$$$$$$$$$$$$$$$$$$$$"
    );

    // Start server
    app.listen(PORT, () => {
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
  } catch (error) {
    console.error("********Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log(
    "\n-----------------------hutting down gracefully...--------------------------"
  );
  await prisma.$disconnect();
  console.log("*************  Database disconnected ******************");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log(
    "\n-----------------------hutting down gracefully...--------------------------"
  );
  await prisma.$disconnect();
  console.log("*************  Database disconnected ******************");
  process.exit(0);
});

startServer();

export default app;
