"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Récupérer tous les rendez-vous avec filtres
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *   post:
 *     summary: Créer un nouveau rendez-vous
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *             required: [patientId, doctorId, date, reason]
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /appointments/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer un rendez-vous par son ID
 *     tags:
 *       - Appointments
 *     responses:
 *       200:
 *         description: Rendez-vous trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un rendez-vous
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rendez-vous mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un rendez-vous
 *     tags:
 *       - Appointments
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /appointments/{id}/status:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   patch:
 *     summary: Mettre à jour le statut d'un rendez-vous
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *             required: [status]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /appointments/patient/{patientId}:
 *   parameters:
 *     - in: path
 *       name: patientId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les rendez-vous d'un patient
 *     tags:
 *       - Appointments
 *     responses:
 *       200:
 *         description: Rendez-vous du patient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *
 * /appointments/doctor/{doctorId}:
 *   parameters:
 *     - in: path
 *       name: doctorId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les rendez-vous d'un médecin
 *     tags:
 *       - Appointments
 *     responses:
 *       200:
 *         description: Rendez-vous du médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 */
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
