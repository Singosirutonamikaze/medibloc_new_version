"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const patient_routes_1 = __importDefault(require("./patient.routes"));
const doctor_routes_1 = __importDefault(require("./doctor.routes"));
const appointment_routes_1 = __importDefault(require("./appointment.routes"));
const disease_routes_1 = __importDefault(require("./disease.routes"));
const symptom_routes_1 = __importDefault(require("./symptom.routes"));
const medicine_routes_1 = __importDefault(require("./medicine.routes"));
const pharmacy_routes_1 = __importDefault(require("./pharmacy.routes"));
const prescription_routes_1 = __importDefault(require("./prescription.routes"));
const medicalRecord_routes_1 = __importDefault(require("./medicalRecord.routes"));
const stats_routes_1 = __importDefault(require("./stats.routes"));
const router = (0, express_1.Router)();
// Routes d'authentification
router.use('/auth', auth_routes_1.default);
// Routes protégées
router.use('/users', user_routes_1.default);
router.use('/patients', patient_routes_1.default);
router.use('/doctors', doctor_routes_1.default);
router.use('/appointments', appointment_routes_1.default);
router.use('/diseases', disease_routes_1.default);
router.use('/symptoms', symptom_routes_1.default);
router.use('/medicines', medicine_routes_1.default);
router.use('/pharmacies', pharmacy_routes_1.default);
router.use('/prescriptions', prescription_routes_1.default);
router.use('/medical-records', medicalRecord_routes_1.default);
router.use('/stats', stats_routes_1.default);
// Route de santé de l'API
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API MédiBloc en fonctionnement',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
