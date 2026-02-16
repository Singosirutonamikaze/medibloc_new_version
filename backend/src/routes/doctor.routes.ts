import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const doctorController = new DoctorController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createDoctor),
  doctorController.createDoctor
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateDoctor),
  doctorController.updateDoctor
);

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

export default router;