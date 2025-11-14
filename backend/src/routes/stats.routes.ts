import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const statsController = new StatsController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/**
 * @route GET /api/v1/stats/dashboard
 * @description Récupérer les statistiques du tableau de bord
 * @access Private/Admin
 */
router.get('/dashboard', statsController.getDashboardStats);

/**
 * @route GET /api/v1/stats/diseases
 * @description Récupérer les statistiques des maladies
 * @access Private/Admin
 */
router.get('/diseases', statsController.getDiseaseStats);

/**
 * @route GET /api/v1/stats/appointments
 * @description Récupérer les statistiques des rendez-vous
 * @access Private/Admin/Doctor
 */
router.get('/appointments', statsController.getAppointmentStats);

/**
 * @route GET /api/v1/stats/patients
 * @description Récupérer les statistiques des patients
 * @access Private/Admin
 */
router.get('/patients', statsController.getPatientStats);

export default router;