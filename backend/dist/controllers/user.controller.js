"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class UserController {
    constructor() {
        this.getUserProfile = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const userId = req.user?.id;
                if (!userId) {
                    status = 401;
                    response = { success: false, error: 'Non authentifié' };
                }
                else {
                    const user = await database_1.default.user.findUnique({ where: { id: userId }, include: { profile: true } });
                    if (!user) {
                        status = 404;
                        response = { success: false, error: "Utilisateur non trouvé" };
                    }
                    else {
                        response = { success: true, data: user };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.user.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.user.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.user.create({ data: params.data }),
            update: (params) => database_1.default.user.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.user.delete({ where: params.where }),
            count: (params) => database_1.default.user.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        // bind route methods
        this.getAllUsers = this.generic.getAll;
        this.getUserById = this.generic.getOne;
        this.updateUser = this.generic.update;
        this.deleteUser = this.generic.delete;
    }
}
exports.UserController = UserController;
