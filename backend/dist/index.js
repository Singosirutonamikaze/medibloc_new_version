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
app.use((0, cors_1.default)(config_1.config.cors));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// API Routes
app.use('/api/v1', index_routes_1.default);
// Error handling
app.use(error_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
// Database connection and server start
const PORT = config_1.config.port;
const startServer = async () => {
    try {
        await database_1.default.$connect();
        console.log('\n$$$$$$$$$$$$$$$$$$$$$ Database connected successfully $$$$$$$$$$$$$$$$$$$$$');
        // Start server
        app.listen(PORT, () => {
            console.log('---------------------------------------------------------------\n');
            console.log('-----------------------  Server Started  --------------------------\n');
            console.log(`********   Server is running on port ${PORT} *********************\n`);
            console.log(`********   Environment: ${config_1.config.nodeEnv}  ***********************\n`);
            console.log(`********   API URL: http://localhost:${PORT}/api/v1  *********************\n`);
            console.log(`********   Health check: http://localhost:${PORT}/api/v1/health  *********************\n`);
            console.log('\n---------------------------------------------------------------\n');
        });
    }
    catch (error) {
        console.error('********Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n-----------------------hutting down gracefully...--------------------------');
    await database_1.default.$disconnect();
    console.log('*************  Database disconnected ******************');
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await database_1.default.$disconnect();
    console.log('Database disconnected');
    process.exit(0);
});
startServer();
exports.default = app;
