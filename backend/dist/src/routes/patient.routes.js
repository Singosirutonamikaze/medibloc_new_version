"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
/**
 * @openapi
 * /patients:
 *   get:
 *     summary: Récupérer tous les patients avec pagination
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Liste des patients
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
 *                     $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Créer un nouveau patient
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               bloodType:
 *                 type: string
 *                 enum: [O+, O-, A+, A-, B+, B-, AB+, AB-]
 *               allergies:
 *                 type: string
 *             required: [dateOfBirth, gender, phone, address]
 *     responses:
 *       201:
 *         description: Patient créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /patients/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Patient ID
 *   get:
 *     summary: Récupérer un patient par son ID
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: Patient trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un patient
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               bloodType:
 *                 type: string
 *               allergies:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un patient
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: Patient supprimé
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
 *         description: Patient non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /patients/{id}/diseases:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les maladies d'un patient
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: Maladies du patient
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
 *                     type: object
 *
 * /patients/{id}/appointments:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les rendez-vous d'un patient
 *     tags:
 *       - Patients
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
 * /patients/{id}/prescriptions:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les ordonnances d'un patient
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: Ordonnances du patient
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
 */
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
