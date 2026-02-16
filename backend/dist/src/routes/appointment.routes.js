"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const appointmentController = new appointment_controller_1.AppointmentController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/appointments
 * @description Récupérer tous les rendez-vous avec filtres
 * @access Private
 */
router.get('/', appointmentController.getAllAppointments);
/**
 * @route POST /api/v1/appointments
 * @description Créer un nouveau rendez-vous
 * @access Private
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createAppointment), appointmentController.createAppointment);
/**
 * @route GET /api/v1/appointments/:id
 * @description Récupérer un rendez-vous par son ID
 * @access Private
 */
router.get('/:id', appointmentController.getAppointmentById);
/**
 * @route PUT /api/v1/appointments/:id
 * @description Mettre à jour un rendez-vous
 * @access Private
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateAppointment), appointmentController.updateAppointment);
/**
 * @route DELETE /api/v1/appointments/:id
 * @description Supprimer un rendez-vous
 * @access Private
 */
router.delete('/:id', appointmentController.deleteAppointment);
/**
 * @route PATCH /api/v1/appointments/:id/status
 * @description Mettre à jour le statut d'un rendez-vous
 * @access Private/Doctor
 */
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
/**
 * @route GET /api/v1/appointments/patient/:patientId
 * @description Récupérer les rendez-vous d'un patient
 * @access Private
 */
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
/**
 * @route GET /api/v1/appointments/doctor/:doctorId
 * @description Récupérer les rendez-vous d'un médecin
 * @access Private
 */
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);
exports.default = router;
