"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_middleware_2 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const doctorController = new doctor_controller_1.DoctorController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/doctors
 * @description Récupérer tous les médecins avec pagination
 * @access Private
 */
router.get('/', doctorController.getAllDoctors);
/**
 * @route POST /api/v1/doctors
 * @description Créer un nouveau médecin
 * @access Private/Admin
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.createDoctor), doctorController.createDoctor);
/**
 * @route GET /api/v1/doctors/:id
 * @description Récupérer un médecin par son ID
 * @access Private
 */
router.get('/:id', doctorController.getDoctorById);
/**
 * @route PUT /api/v1/doctors/:id
 * @description Mettre à jour un médecin
 * @access Private
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.updateDoctor), doctorController.updateDoctor);
/**
 * @route DELETE /api/v1/doctors/:id
 * @description Supprimer un médecin
 * @access Private/Admin
 */
router.delete('/:id', doctorController.deleteDoctor);
/**
 * @route GET /api/v1/doctors/:id/appointments
 * @description Récupérer les rendez-vous d'un médecin
 * @access Private
 */
router.get('/:id/appointments', doctorController.getDoctorAppointments);
/**
 * @route GET /api/v1/doctors/:id/prescriptions
 * @description Récupérer les ordonnances d'un médecin
 * @access Private
 */
router.get('/:id/prescriptions', doctorController.getDoctorPrescriptions);
/**
 * @route GET /api/v1/doctors/specialties/list
 * @description Récupérer la liste des spécialités disponibles
 * @access Private
 */
router.get('/specialties/list', doctorController.getSpecialties);
exports.default = router;
