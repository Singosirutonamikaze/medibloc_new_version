import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescription.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

/**
 * @openapi
 * /prescriptions:
 *   get:
 *     summary: Récupérer toutes les ordonnances
 *     tags:
 *       - Prescriptions
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
 *         name: patientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des ordonnances
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
 *   post:
 *     summary: Créer une nouvelle ordonnance
 *     tags:
 *       - Prescriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               medicineId:
 *                 type: integer
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               duration:
 *                 type: string
 *               notes:
 *                 type: string
 *             required: [patientId, medicineId, dosage, frequency, duration]
 *     responses:
 *       201:
 *         description: Ordonnance créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /prescriptions/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer une ordonnance par son ID
 *     tags:
 *       - Prescriptions
 *     responses:
 *       200:
 *         description: Ordonnance trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Ordonnance non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer une ordonnance
 *     tags:
 *       - Prescriptions
 *     responses:
 *       200:
 *         description: Ordonnance supprimée
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
 *         description: Ordonnance non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /prescriptions/patient/{patientId}:
 *   parameters:
 *     - in: path
 *       name: patientId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les ordonnances d'un patient
 *     tags:
 *       - Prescriptions
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
 *
 * /prescriptions/doctor/{doctorId}:
 *   parameters:
 *     - in: path
 *       name: doctorId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les ordonnances d'un médecin
 *     tags:
 *       - Prescriptions
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
 */

const router = Router();
const prescriptionController = new PrescriptionController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createPrescription),
  prescriptionController.createPrescription
);

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

export default router;