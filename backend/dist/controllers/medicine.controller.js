"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class MedicineController {
    constructor() {
        this.getMedicinesByType = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const type = req.params.type;
                const medicines = await database_1.default.medicine.findMany({ where: { type: type } });
                response = { success: true, data: medicines };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getMedicinesByPharmacy = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const pharmacyId = Number(req.params.pharmacyId);
                if (!pharmacyId || pharmacyId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const medicines = await database_1.default.medicine.findMany({ where: { pharmacyId } });
                    response = { success: true, data: medicines };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.medicine.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.medicine.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.medicine.create({ data: params.data }),
            update: (params) => database_1.default.medicine.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.medicine.delete({ where: params.where }),
            count: (params) => database_1.default.medicine.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllMedicines = this.generic.getAll;
        this.createMedicine = this.generic.create;
        this.getMedicineById = this.generic.getOne;
        this.updateMedicine = this.generic.update;
        this.deleteMedicine = this.generic.delete;
    }
}
exports.MedicineController = MedicineController;
