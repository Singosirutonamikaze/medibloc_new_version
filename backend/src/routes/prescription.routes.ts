import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescription.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePrescriptionDto } from '../types';
import { validationSchemas } from '../middleware/validation.middleware';

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