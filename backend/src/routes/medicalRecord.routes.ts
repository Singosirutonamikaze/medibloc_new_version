import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecord.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

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