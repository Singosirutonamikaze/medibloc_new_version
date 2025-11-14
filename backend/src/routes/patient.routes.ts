import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePatientDto, UpdatePatientDto } from '../types';
import { validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const patientController = new PatientController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  // Use createPatient runtime schema
  validationMiddleware(validationSchemas.createPatient),
  patientController.createPatient
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updatePatient),
  patientController.updatePatient
);

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

export default router;