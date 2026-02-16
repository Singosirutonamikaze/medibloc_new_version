"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiseaseController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class DiseaseController {
    constructor() {
        this.getDiseaseSymptoms = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const disease = await database_1.default.disease.findUnique({ where: { id }, include: { symptoms: { include: { symptom: true } } } });
                    if (disease) {
                        response = { success: true, data: disease.symptoms };
                    }
                    else {
                        status = 404;
                        response = { success: false, error: 'Maladie non trouvée' };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getDiseaseCountries = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const countries = await database_1.default.country.findMany({ where: { diseasesPresent: { some: { diseaseId: id } } } });
                    response = { success: true, data: countries };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.addSymptomToDisease = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                const symptomId = Number(req.params.symptomId);
                if (!id || id <= 0 || !symptomId || symptomId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiants invalides' };
                }
                else {
                    const updated = await database_1.default.disease.update({ where: { id }, data: { symptoms: { connect: { id: symptomId } } } });
                    response = { success: true, data: updated };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.removeSymptomFromDisease = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                const symptomId = Number(req.params.symptomId);
                if (!id || id <= 0 || !symptomId || symptomId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiants invalides' };
                }
                else {
                    const updated = await database_1.default.disease.update({ where: { id }, data: { symptoms: { disconnect: { id: symptomId } } } });
                    response = { success: true, data: updated };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.disease.findMany(params),
            findUnique: (params) => database_1.default.disease.findUnique(params),
            create: (params) => database_1.default.disease.create({ data: params.data }),
            update: (params) => database_1.default.disease.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.disease.delete({ where: params.where }),
            count: (params) => database_1.default.disease.count(params),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllDiseases = this.generic.getAll;
        this.createDisease = this.generic.create;
        this.getDiseaseById = this.generic.getOne;
        this.updateDisease = this.generic.update;
        this.deleteDisease = this.generic.delete;
    }
}
exports.DiseaseController = DiseaseController;
