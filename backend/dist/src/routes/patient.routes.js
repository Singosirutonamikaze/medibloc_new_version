"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const patientController = new patient_controller_1.PatientController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/patients
 * @description Récupérer tous les patients avec pagination
 * @access Private/Doctor/Admin
 */
router.get('/', patientController.getAllPatients);
/**
 * @route POST /api/v1/patients
 * @description Créer un nouveau patient
 * @access Private/Admin
 */
router.post('/', 
// Use createPatient runtime schema
(0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createPatient), patientController.createPatient);
/**
 * @route GET /api/v1/patients/:id
 * @description Récupérer un patient par son ID
 * @access Private
 */
router.get('/:id', patientController.getPatientById);
/**
 * @route PUT /api/v1/patients/:id
 * @description Mettre à jour un patient
 * @access Private
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updatePatient), patientController.updatePatient);
/**
 * @route DELETE /api/v1/patients/:id
 * @description Supprimer un patient
 * @access Private/Admin
 */
router.delete('/:id', patientController.deletePatient);
/**
 * @route GET /api/v1/patients/:id/diseases
 * @description Récupérer les maladies d'un patient
 * @access Private
 */
router.get('/:id/diseases', patientController.getPatientDiseases);
/**
 * @route GET /api/v1/patients/:id/appointments
 * @description Récupérer les rendez-vous d'un patient
 * @access Private
 */
router.get('/:id/appointments', patientController.getPatientAppointments);
/**
 * @route GET /api/v1/patients/:id/prescriptions
 * @description Récupérer les ordonnances d'un patient
 * @access Private
 */
router.get('/:id/prescriptions', patientController.getPatientPrescriptions);
exports.default = router;
