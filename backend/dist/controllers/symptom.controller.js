"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class SymptomController {
    constructor() {
        this.getSymptomDiseases = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const diseases = await database_1.default.disease.findMany({
                        where: { symptoms: { some: { symptomId: id } } }
                    });
                    response = { success: true, data: diseases };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.symptom.findMany(params),
            findUnique: (params) => database_1.default.symptom.findUnique(params),
            create: (params) => database_1.default.symptom.create({ data: params.data }),
            update: (params) => database_1.default.symptom.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.symptom.delete({ where: params.where }),
            count: (params) => database_1.default.symptom.count(params),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllSymptoms = this.generic.getAll;
        this.createSymptom = this.generic.create;
        this.getSymptomById = this.generic.getOne;
        this.updateSymptom = this.generic.update;
        this.deleteSymptom = this.generic.delete;
    }
}
exports.SymptomController = SymptomController;
