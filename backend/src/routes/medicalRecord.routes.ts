import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecord.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

/**
 * @openapi
 * /medical-records:
 *   get:
 *     summary: Récupérer tous les dossiers médicaux
 *     tags:
 *       - MedicalRecords
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
 *     responses:
 *       200:
 *         description: Liste des dossiers médicaux
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
 *                     $ref: '#/components/schemas/MedicalRecord'
 *   post:
 *     summary: Créer un nouveau dossier médical
 *     tags:
 *       - MedicalRecords
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
 *               diagnosis:
 *                 type: string
 *               treatment:
 *                 type: string
 *               notes:
 *                 type: string
 *             required: [patientId, doctorId, diagnosis, treatment]
 *     responses:
 *       201:
 *         description: Dossier médical créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MedicalRecord'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /medical-records/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer un dossier médical par son ID
 *     tags:
 *       - MedicalRecords
 *     responses:
 *       200:
 *         description: Dossier médical trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MedicalRecord'
 *       404:
 *         description: Dossier médical non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un dossier médical
 *     tags:
 *       - MedicalRecords
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               treatment:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dossier médical mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MedicalRecord'
 *       404:
 *         description: Dossier médical non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un dossier médical
 *     tags:
 *       - MedicalRecords
 *     responses:
 *       200:
 *         description: Dossier médical supprimé
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
 *         description: Dossier médical non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /medical-records/patient/{patientId}:
 *   parameters:
 *     - in: path
 *       name: patientId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les dossiers médicaux d'un patient
 *     tags:
 *       - MedicalRecords
 *     responses:
 *       200:
 *         description: Dossiers médicaux du patient
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
 *                     $ref: '#/components/schemas/MedicalRecord'
 */

const router = Router();
const medicalRecordController = new MedicalRecordController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/**
 * @route GET /api/v1/medical-records
 * @description Récupérer tous les dossiers médicaux (Admin seulement)
 * @access Private/Admin
 */
router.get('/', medicalRecordController.getAllMedicalRecords);

/**
 * @route POST /api/v1/medical-records
 * @description Créer un nouveau dossier médical
 * @access Private/Doctor
 */
router.post(
  '/',
  validationMiddleware(validationSchemas.createMedicalRecord),
  medicalRecordController.createMedicalRecord
);

/**
 * @route GET /api/v1/medical-records/:id
 * @description Récupérer un dossier médical par son ID
 * @access Private
 */
router.get('/:id', medicalRecordController.getMedicalRecordById);

/**
 * @route PUT /api/v1/medical-records/:id
 * @description Mettre à jour un dossier médical
 * @access Private/Doctor
 */
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateMedicalRecord),
  medicalRecordController.updateMedicalRecord
);

/**
 * @route DELETE /api/v1/medical-records/:id
 * @description Supprimer un dossier médical
 * @access Private/Doctor/Admin
 */
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

/**
 * @route GET /api/v1/medical-records/patient/:patientId
 * @description Récupérer les dossiers médicaux d'un patient
 * @access Private
 */
router.get('/patient/:patientId', medicalRecordController.getPatientMedicalRecords);

export default router;