"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
const resolveDatabaseUrl = () => {
    const dbUrl = process.env.DATABASE_URL || '';
    const password = process.env.PASSWORD || '';
    if (password && dbUrl.includes('PASSWORD')) {
        return dbUrl.replace('PASSWORD', password);
    }
    return dbUrl;
};
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: resolveDatabaseUrl(),
    },
});
