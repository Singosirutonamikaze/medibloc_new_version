"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class PatientController {
    constructor() {
        this.getPatientDiseases = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const patient = await database_1.default.patient.findUnique({
                        where: { id },
                        include: { diseases: { include: { disease: true } } }
                    });
                    if (patient) {
                        response = { success: true, data: patient.diseases };
                    }
                    else {
                        status = 404;
                        response = { success: false, error: 'Patient non trouvé' };
                    }
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getPatientAppointments = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const appointments = await database_1.default.appointment.findMany({ where: { patientId: id } });
                    response = { success: true, data: appointments };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getPatientPrescriptions = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const prescriptions = await database_1.default.prescription.findMany({ where: { patientId: id } });
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
            findMany: (params) => database_1.default.patient.findMany(params),
            findUnique: (params) => database_1.default.patient.findUnique(params),
            create: (params) => database_1.default.patient.create({ data: params.data }),
            update: (params) => database_1.default.patient.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.patient.delete({ where: params.where }),
            count: (params) => database_1.default.patient.count(params),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllPatients = this.generic.getAll;
        this.createPatient = this.generic.create;
        this.getPatientById = this.generic.getOne;
        this.updatePatient = this.generic.update;
        this.deletePatient = this.generic.delete;
    }
}
exports.PatientController = PatientController;
