"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("./config/config");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const database_lifecycle_1 = require("./config/database-lifecycle");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
// Créer le dossier logs s'il n'existe pas
const logsDir = node_path_1.default.join(process.cwd(), 'logs');
if (!node_fs_1.default.existsSync(logsDir)) {
    node_fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Configurer Morgan pour écrire dans les logs
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
const accessLogStream = node_fs_1.default.createWriteStream(node_path_1.default.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`), { flags: 'a' });
const app = (0, express_1.default)();
// Middleware
// Morgan - Logs toutes les requêtes HTTP
app.use((0, morgan_1.default)(morganFormat, { stream: accessLogStream }));
app.use((0, morgan_1.default)('dev')); // Aussi afficher dans la console
// Build safe CORS options from configuration
const buildCorsOptions = () => {
    const { origin, parsedOrigins, credentials } = config_1.config.cors;
    // If wildcard is used, do not send credentials (browsers disallow Access-Control-Allow-Origin: * with credentials)
    if (origin === "http://localhost:5173") {
        if (credentials) {
            console.warn('CORS: origin="http://localhost:5173" and credentials=true is not supported by browsers. Credentials will be disabled.');
        }
        return {
            origin: "http://localhost:5173",
            credentials: false,
        };
    }
    // Use a whitelist function for multiple or single origins
    const whitelist = Array.isArray(parsedOrigins) ? parsedOrigins : [origin];
    return {
        origin: (reqOrigin, callback) => {
            // Allow requests with no origin (like curl or server-to-server requests)
            if (!reqOrigin)
                return callback(null, true);
            if (whitelist.includes(reqOrigin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: !!credentials,
    };
};
app.use((0, cors_1.default)(buildCorsOptions()));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// API Routes
app.use("/api/v1", index_routes_1.default);
// Error handling
app.use(error_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
// Database connection and server start
const PORT = config_1.config.port;
const startServer = async () => {
    try {
        // Initialize database connection
        await (0, database_lifecycle_1.initializeDatabase)();
        // Start server
        const server = app.listen(PORT, () => {
            console.log("---------------------------------------------------------------\n");
            console.log("-----------------------  Server Started  --------------------------\n");
            console.log(`********   Server is running on port ${PORT} *********************\n`);
            console.log(`********   Environment: ${config_1.config.nodeEnv}  ***********************\n`);
            console.log(`********   API URL: http://localhost:${PORT}/api/v1  *********************\n`);
            console.log(`********   Health check: http://localhost:${PORT}/api/v1/health  *********************\n`);
            console.log("\n---------------------------------------------------------------\n");
        });
        // Store server reference for graceful shutdown
        return server;
    }
    catch (error) {
        console.error(" Failed to start server:", error);
        await (0, database_lifecycle_1.disconnectDatabase)();
        process.exit(1);
    }
};
// Graceful shutdown
const setupGracefulShutdown = () => {
    const shutdown = async (signal) => {
        console.log(`\n-----------------------${signal}: Shutting down gracefully...--------------------------`);
        await (0, database_lifecycle_1.disconnectDatabase)();
        console.log("*************  Server stopped ******************");
        process.exit(0);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
};
// Start application
const start = async () => {
    try {
        await startServer();
        setupGracefulShutdown();
    }
    catch (error) {
        console.error('Failed to bootstrap server:', error);
        process.exit(1);
    }
};
start();
exports.default = app;
