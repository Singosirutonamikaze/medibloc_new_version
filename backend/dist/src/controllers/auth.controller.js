"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = __importDefault(require("../config/database"));
const helpers_1 = require("../utils/helpers");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            let status = 201;
            let response = { success: true, data: null };
            try {
                const body = req.body;
                const existing = await database_1.default.user.findUnique({ where: { email: body.email } });
                if (existing) {
                    status = 409;
                    response = { success: false, error: 'Email déjà utilisé' };
                }
                else {
                    const hashed = await (0, helpers_1.hashPassword)(body.password);
                    const user = await database_1.default.user.create({ data: { email: body.email, password: hashed, firstName: body.firstName, lastName: body.lastName, role: body.role ?? 'PATIENT' } });
                    const token = (0, helpers_1.generateToken)({ id: user.id, email: user.email, role: user.role });
                    response = { success: true, data: { user, token }, message: 'Utilisateur créé' };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.login = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const { email, password } = req.body;
                const user = await database_1.default.user.findUnique({ where: { email } });
                if (user) {
                    const ok = await (0, helpers_1.comparePassword)(password, user.password);
                    if (ok) {
                        const token = (0, helpers_1.generateToken)({ id: user.id, email: user.email, role: user.role });
                        // hide password
                        // @ts-ignore
                        const { password: _pwd, ...safeUser } = user;
                        response = { success: true, data: { user: safeUser, token } };
                    }
                    else {
                        status = 401;
                        response = { success: false, error: 'Identifiants invalides' };
                    }
                }
                else {
                    status = 401;
                    response = { success: false, error: 'Identifiants invalides' };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getCurrentUser = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const userId = req.user?.id;
                if (userId) {
                    const user = await database_1.default.user.findUnique({ where: { id: userId } });
                    if (user) {
                        status = 404;
                        response = { success: false, error: 'Utilisateur non trouvé' };
                    }
                    else {
                        // @ts-ignore
                        const { password: _pwd, ...safeUser } = user;
                        response = { success: true, data: safeUser };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.refreshToken = async (_req, res) => {
            return res.status(501).json({ success: false, error: 'Not implemented' });
        };
        this.logout = async (_req, res) => {
            return res.json({ success: true, message: 'Déconnecté' });
        };
    }
}
exports.AuthController = AuthController;
