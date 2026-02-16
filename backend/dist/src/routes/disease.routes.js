"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disease_controller_1 = require("../controllers/disease.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
/**
 * @openapi
 * /diseases:
 *   get:
 *     summary: Récupérer toutes les maladies
 *     tags:
 *       - Diseases
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des maladies
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
 *   post:
 *     summary: Créer une nouvelle maladie
 *     tags:
 *       - Diseases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *             required: [name, description]
 *     responses:
 *       201:
 *         description: Maladie créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /diseases/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer une maladie par son ID
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Maladie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Maladie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour une maladie
 *     tags:
 *       - Diseases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maladie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Maladie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer une maladie
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Maladie supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Maladie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /diseases/{id}/symptoms:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les symptômes d'une maladie
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Symptômes de la maladie
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
 *
 * /diseases/{id}/countries:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les pays où la maladie est prévalente
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Pays où la maladie est présente
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
 *
 * /diseases/{id}/symptoms/{symptomId}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *     - in: path
 *       name: symptomId
 *       required: true
 *       schema:
 *         type: integer
 *   post:
 *     summary: Associer un symptôme à une maladie
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Symptôme associé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *   delete:
 *     summary: Dissocier un symptôme d'une maladie
 *     tags:
 *       - Diseases
 *     responses:
 *       200:
 *         description: Association supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
const router = (0, express_1.Router)();
const diseaseController = new disease_controller_1.DiseaseController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/diseases
 * @description Récupérer toutes les maladies avec pagination
 * @access Private
 */
router.get('/', diseaseController.getAllDiseases);
/**
 * @route POST /api/v1/diseases
 * @description Créer une nouvelle maladie (Admin seulement)
 * @access Private/Admin
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createDisease), diseaseController.createDisease);
/**
 * @route GET /api/v1/diseases/:id
 * @description Récupérer une maladie par son ID
 * @access Private
 */
router.get('/:id', diseaseController.getDiseaseById);
/**
 * @route PUT /api/v1/diseases/:id
 * @description Mettre à jour une maladie (Admin seulement)
 * @access Private/Admin
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateDisease), diseaseController.updateDisease);
/**
 * @route DELETE /api/v1/diseases/:id
 * @description Supprimer une maladie (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id', diseaseController.deleteDisease);
/**
 * @route GET /api/v1/diseases/:id/symptoms
 * @description Récupérer les symptômes d'une maladie
 * @access Private
 */
router.get('/:id/symptoms', diseaseController.getDiseaseSymptoms);
/**
 * @route GET /api/v1/diseases/:id/countries
 * @description Récupérer les pays où la maladie est prévalente
 * @access Private
 */
router.get('/:id/countries', diseaseController.getDiseaseCountries);
/**
 * @route POST /api/v1/diseases/:id/symptoms/:symptomId
 * @description Associer un symptôme à une maladie (Admin seulement)
 * @access Private/Admin
 */
router.post('/:id/symptoms/:symptomId', diseaseController.addSymptomToDisease);
/**
 * @route DELETE /api/v1/diseases/:id/symptoms/:symptomId
 * @description Dissocier un symptôme d'une maladie (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id/symptoms/:symptomId', diseaseController.removeSymptomFromDisease);
exports.default = router;
