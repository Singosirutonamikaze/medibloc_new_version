"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
/**
 * @openapi
 * /stats/dashboard:
 *   get:
 *     summary: Récupérer les statistiques du tableau de bord
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Statistiques du tableau de bord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPatients:
 *                       type: integer
 *                     totalDoctors:
 *                       type: integer
 *                     totalAppointments:
 *                       type: integer
 *                     totalPrescriptions:
 *                       type: integer
 *
 * /stats/diseases:
 *   get:
 *     summary: Récupérer les statistiques des maladies
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Statistiques des maladies
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
 *                     properties:
 *                       name:
 *                         type: string
 *                       count:
 *                         type: integer
 *
 * /stats/appointments:
 *   get:
 *     summary: Récupérer les statistiques des rendez-vous
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Statistiques des rendez-vous
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     confirmed:
 *                       type: integer
 *                     cancelled:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *
 * /stats/patients:
 *   get:
 *     summary: Récupérer les statistiques des patients
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Statistiques des patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     newThisMonth:
 *                       type: integer
 *                     active:
 *                       type: integer
 */
const router = (0, express_1.Router)();
const statsController = new stats_controller_1.StatsController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
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
exports.default = router;
