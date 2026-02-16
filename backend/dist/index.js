"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config/config");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
// Middleware
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
            if (whitelist.indexOf(reqOrigin) !== -1) {
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
// API Routes
app.use("/api/v1", index_routes_1.default);
// Error handling
app.use(error_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
// Database connection and server start
const PORT = config_1.config.port;
const startServer = async () => {
    try {
        await database_1.default.$connect();
        console.log("\n$$$$$$$$$$$$$$$$$$$$$ Database connected successfully $$$$$$$$$$$$$$$$$$$$$");
        // Start server
        app.listen(PORT, () => {
            console.log("---------------------------------------------------------------\n");
            console.log("-----------------------  Server Started  --------------------------\n");
            console.log(`********   Server is running on port ${PORT} *********************\n`);
            console.log(`********   Environment: ${config_1.config.nodeEnv}  ***********************\n`);
            console.log(`********   API URL: http://localhost:${PORT}/api/v1  *********************\n`);
            console.log(`********   Health check: http://localhost:${PORT}/api/v1/health  *********************\n`);
            console.log("\n---------------------------------------------------------------\n");
        });
    }
    catch (error) {
        console.error("********Failed to start server:", error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("\n-----------------------hutting down gracefully...--------------------------");
    await database_1.default.$disconnect();
    console.log("*************  Database disconnected ******************");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("\n-----------------------hutting down gracefully...--------------------------");
    await database_1.default.$disconnect();
    console.log("*************  Database disconnected ******************");
    process.exit(0);
});
startServer();
exports.default = app;
