"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const database_1 = __importDefault(require("../config/database"));
const generic_controller_1 = __importDefault(require("../gen/generic.controller"));
class AppointmentController {
    constructor() {
        this.updateAppointmentStatus = async (req, res) => {
            let status = 200;
            let response = { success: true, data: null };
            try {
                const id = Number(req.params.id);
                const { status: newStatus } = req.body;
                if (!id || id <= 0 || !newStatus) {
                    status = 400;
                    response = { success: false, error: 'Paramètres invalides' };
                }
                else {
                    const updated = await database_1.default.appointment.update({ where: { id }, data: { status: newStatus } });
                    response = { success: true, data: updated };
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
                const patientId = Number(req.params.patientId);
                if (!patientId || patientId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const appointments = await database_1.default.appointment.findMany({ where: { patientId } });
                    response = { success: true, data: appointments };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getDoctorAppointments = async (req, res) => {
            let status = 200;
            let response = { success: true, data: [] };
            try {
                const doctorId = Number(req.params.doctorId);
                if (!doctorId || doctorId <= 0) {
                    status = 400;
                    response = { success: false, error: 'Identifiant invalide' };
                }
                else {
                    const appointments = await database_1.default.appointment.findMany({ where: { doctorId } });
                    response = { success: true, data: appointments };
                }
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        const repo = {
            findMany: (params) => database_1.default.appointment.findMany({ where: params?.where, skip: params?.skip, take: params?.take, include: params?.include }),
            findUnique: (params) => database_1.default.appointment.findUnique({ where: params.where, include: params.include }),
            create: (params) => database_1.default.appointment.create({ data: params.data }),
            update: (params) => database_1.default.appointment.update({ where: params.where, data: params.data }),
            delete: (params) => database_1.default.appointment.delete({ where: params.where }),
            count: (params) => database_1.default.appointment.count({ where: params?.where }),
        };
        this.generic = new generic_controller_1.default(repo);
        this.getAllAppointments = this.generic.getAll;
        this.createAppointment = this.generic.create;
        this.getAppointmentById = this.generic.getOne;
        this.updateAppointment = this.generic.update;
        this.deleteAppointment = this.generic.delete;
    }
}
exports.AppointmentController = AppointmentController;
