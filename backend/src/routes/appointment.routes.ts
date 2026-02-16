import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const appointmentController = new AppointmentController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createAppointment),
  appointmentController.createAppointment
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateAppointment),
  appointmentController.updateAppointment
);

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

export default router;