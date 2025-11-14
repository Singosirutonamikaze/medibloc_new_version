"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const database_1 = __importDefault(require("../config/database"));
class StatsController {
    constructor() {
        this.getOverview = async (_req, res) => {
            let status = 200;
            let response = { success: true, data: {} };
            try {
                const users = await database_1.default.user.count();
                const patients = await database_1.default.patient.count();
                const doctors = await database_1.default.doctor.count();
                const appointments = await database_1.default.appointment.count();
                response = {
                    success: true,
                    data: { users, patients, doctors, appointments },
                };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getDashboardStats = this.getOverview;
        this.getDiseaseStats = async (_req, res) => {
            let status = 200;
            let response = { success: true, data: {} };
            try {
                const total = await database_1.default.disease.count();
                // simple example: return total diseases
                response = { success: true, data: { total } };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getAppointmentStats = async (_req, res) => {
            let status = 200;
            let response = { success: true, data: {} };
            try {
                const total = await database_1.default.appointment.count();
                response = { success: true, data: { total } };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
        this.getPatientStats = async (_req, res) => {
            let status = 200;
            let response = { success: true, data: {} };
            try {
                const total = await database_1.default.patient.count();
                response = { success: true, data: { total } };
            }
            catch (err) {
                status = 500;
                response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
            }
            return res.status(status).json(response);
        };
    }
}
exports.StatsController = StatsController;
