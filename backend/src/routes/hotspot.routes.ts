import { Router } from 'express';
import { HotspotController } from '../controllers/hotspot.controller';

const router = Router();
const controller = new HotspotController();

/**
 * @openapi
 * /hotspots:
 *   get:
 *     summary: Hotspots épidémiques agrégés (WHO + ECDC + ProMED)
 *     tags:
 *       - Epidemiology
 *     parameters:
 *       - in: query
 *         name: disease
 *         schema:
 *           type: string
 *         description: Filtrer par nom de maladie (ex: "Dengue")
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [WHO, ECDC, ProMED]
 *         description: Filtrer par source de données
 *       - in: query
 *         name: minCases
 *         schema:
 *           type: integer
 *         description: Filtre totalCases >= N
 *     responses:
 *       200:
 *         description: Liste des hotspots épidémiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 generatedAt:
 *                   type: string
 *                 promedEnabled:
 *                   type: boolean
 *                 sources:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DiseaseHotspot'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', controller.getHotspots);

/**
 * @openapi
 * /hotspots/diseases:
 *   get:
 *     summary: Liste des maladies disponibles dans les hotspots
 *     tags:
 *       - Epidemiology
 *     responses:
 *       200:
 *         description: Tableau des noms de maladies
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
 *                     type: string
 */
router.get('/diseases', controller.getDiseases);

/**
 * @openapi
 * /hotspots/health:
 *   get:
 *     summary: État du service épi-surveillance
 *     tags:
 *       - Epidemiology
 *     responses:
 *       200:
 *         description: Statut + métriques cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: integer
 *                 promedEnabled:
 *                   type: boolean
 *                 cache:
 *                   type: object
 */
router.get('/health', controller.getHealth);

export default router;
