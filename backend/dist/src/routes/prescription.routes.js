"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prescription_controller_1 = require("../controllers/prescription.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_middleware_2 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const prescriptionController = new prescription_controller_1.PrescriptionController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/prescriptions
 * @description Récupérer toutes les ordonnances avec pagination
 * @access Private/Doctor/Admin
 */
router.get('/', prescriptionController.getAllPrescriptions);
/**
 * @route POST /api/v1/prescriptions
 * @description Créer une nouvelle ordonnance
 * @access Private/Doctor
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.createPrescription), prescriptionController.createPrescription);
/**
 * @route GET /api/v1/prescriptions/:id
 * @description Récupérer une ordonnance par son ID
 * @access Private
 */
router.get('/:id', prescriptionController.getPrescriptionById);
/**
 * @route DELETE /api/v1/prescriptions/:id
 * @description Supprimer une ordonnance
 * @access Private/Doctor/Admin
 */
router.delete('/:id', prescriptionController.deletePrescription);
/**
 * @route GET /api/v1/prescriptions/patient/:patientId
 * @description Récupérer les ordonnances d'un patient
 * @access Private
 */
router.get('/patient/:patientId', prescriptionController.getPatientPrescriptions);
/**
 * @route GET /api/v1/prescriptions/doctor/:doctorId
 * @description Récupérer les ordonnances d'un médecin
 * @access Private
 */
router.get('/doctor/:doctorId', prescriptionController.getDoctorPrescriptions);
exports.default = router;
