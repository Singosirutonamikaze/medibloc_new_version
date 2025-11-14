"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class MedicalRecordController {
    constructor() {
        this.getPatientMedicalRecords = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const patientId = Number(req.params.patientId);
                if (!patientId || patientId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant de patient invalide' };
                }
                else {
                    const records = await database_1.default.medicalRecord.findMany({ where: { patientId } });
                    response = { success: true, data: records };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.medicalRecord.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.medicalRecord.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.medicalRecord.create({ data: params.data }),
            update: (params) => database_1.default.medicalRecord.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.medicalRecord.delete({ where: params.where }),
            count: (params) => database_1.default.medicalRecord.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllMedicalRecords = this.generic.getAll;
        this.createMedicalRecord = this.generic.create;
        this.getMedicalRecordById = this.generic.getOne;
        this.updateMedicalRecord = this.generic.update;
        this.deleteMedicalRecord = this.generic.delete;
    }
}
exports.MedicalRecordController = MedicalRecordController;
