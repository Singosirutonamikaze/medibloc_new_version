"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class PharmacyController {
    constructor() {
        this.getPharmaciesByCountry = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const countryId = Number(req.params.countryId);
                if (!countryId || countryId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const pharmacies = await database_1.default.pharmacy.findMany({ where: { countryId } });
                    response = { success: true, data: pharmacies };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getPharmacyMedicines = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const medicines = await database_1.default.medicine.findMany({ where: { pharmacyId: id } });
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
            findMany: (params) => database_1.default.pharmacy.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.pharmacy.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.pharmacy.create({ data: params.data }),
            update: (params) => database_1.default.pharmacy.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.pharmacy.delete({ where: params.where }),
            count: (params) => database_1.default.pharmacy.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllPharmacies = this.generic.getAll;
        this.createPharmacy = this.generic.create;
        this.getPharmacyById = this.generic.getOne;
        this.updatePharmacy = this.generic.update;
        this.deletePharmacy = this.generic.delete;
    }
}
exports.PharmacyController = PharmacyController;
