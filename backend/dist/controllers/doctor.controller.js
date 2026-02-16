"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class DoctorController {
    constructor() {
        this.getDoctorAppointments = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const appointments = await database_1.default.appointment.findMany({ where: { doctorId: id } });
                    response = { success: true, data: appointments };
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
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                if (!id || id <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const prescriptions = await database_1.default.prescription.findMany({ where: { doctorId: id } });
                    response = { success: true, data: prescriptions };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getSpecialties = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const doctors = await database_1.default.doctor.findMany({ select: { specialty: true } });
                const specialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));
                response = { success: true, data: specialties };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.doctor.findMany(params),
            findUnique: (params) => database_1.default.doctor.findUnique(params),
            create: (params) => database_1.default.doctor.create({ data: params.data }),
            update: (params) => database_1.default.doctor.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.doctor.delete({ where: params.where }),
            count: (params) => database_1.default.doctor.count(params),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllDoctors = this.generic.getAll;
        this.createDoctor = this.generic.create;
        this.getDoctorById = this.generic.getOne;
        this.updateDoctor = this.generic.update;
        this.deleteDoctor = this.generic.delete;
    }
}
exports.DoctorController = DoctorController;
