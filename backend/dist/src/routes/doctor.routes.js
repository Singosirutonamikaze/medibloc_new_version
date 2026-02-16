"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
/**
 * @openapi
 * /doctors:
 *   get:
 *     summary: Récupérer tous les médecins
 *     tags:
 *       - Doctors
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
 *         name: specialization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des médecins
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
 *                     $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Créer un nouveau médecin
 *     tags:
 *       - Doctors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *             required: [specialization, licenseNumber, phone, address]
 *     responses:
 *       201:
 *         description: Médecin créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /doctors/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer un médecin par son ID
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Médecin trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Médecin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un médecin
 *     tags:
 *       - Doctors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Médecin mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Médecin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un médecin
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Médecin supprimé
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
 *         description: Médecin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /doctors/{id}/appointments:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les rendez-vous d'un médecin
 *     tags:
 *       - Doctors
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
 *
 * /doctors/{id}/prescriptions:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les ordonnances d'un médecin
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Ordonnances du médecin
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
 *                     $ref: '#/components/schemas/Prescription'
 *
 * /doctors/specialties/list:
 *   get:
 *     summary: Récupérer la liste des spécialités disponibles
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Liste des spécialités
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
 *                     type: string
 */
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
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createDoctor), doctorController.createDoctor);
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
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateDoctor), doctorController.updateDoctor);
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
