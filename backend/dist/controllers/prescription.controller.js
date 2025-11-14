"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class PrescriptionController {
    constructor() {
        this.getPatientPrescriptions = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const patientId = Number(req.params.patientId);
                if (!patientId || patientId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant de patient invalide' };
                }
                else {
                    const prescriptions = await database_1.default.prescription.findMany({ where: { patientId } });
                    response = { success: true, data: prescriptions };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getDoctorPrescriptions = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const doctorId = Number(req.params.doctorId);
                if (!doctorId || doctorId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant de médecin invalide' };
                }
                else {
                    const prescriptions = await database_1.default.prescription.findMany({ where: { doctorId } });
                    response = { success: true, data: prescriptions };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.prescription.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.prescription.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.prescription.create({ data: params.data }),
            update: (params) => database_1.default.prescription.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.prescription.delete({ where: params.where }),
            count: (params) => database_1.default.prescription.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllPrescriptions = this.generic.getAll;
        this.createPrescription = this.generic.create;
        this.getPrescriptionById = this.generic.getOne;
        this.updatePrescription = this.generic.update;
        this.deletePrescription = this.generic.delete;
    }
}
exports.PrescriptionController = PrescriptionController;
