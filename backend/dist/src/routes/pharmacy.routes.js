"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_controller_1 = require("../controllers/pharmacy.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
/**
 * @openapi
 * /pharmacies:
 *   get:
 *     summary: Récupérer toutes les pharmacies
 *     tags:
 *       - Pharmacies
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
 *         description: Liste des pharmacies
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
 *                     $ref: '#/components/schemas/Pharmacy'
 *   post:
 *     summary: Créer une nouvelle pharmacie
 *     tags:
 *       - Pharmacies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *             required: [name, licenseNumber, phone, address]
 *     responses:
 *       201:
 *         description: Pharmacie créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pharmacy'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /pharmacies/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer une pharmacie par son ID
 *     tags:
 *       - Pharmacies
 *     responses:
 *       200:
 *         description: Pharmacie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pharmacy'
 *       404:
 *         description: Pharmacie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour une pharmacie
 *     tags:
 *       - Pharmacies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pharmacie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pharmacy'
 *       404:
 *         description: Pharmacie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer une pharmacie
 *     tags:
 *       - Pharmacies
 *     responses:
 *       200:
 *         description: Pharmacie supprimée
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
 *         description: Pharmacie non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /pharmacies/country/{countryId}:
 *   parameters:
 *     - in: path
 *       name: countryId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les pharmacies d'un pays
 *     tags:
 *       - Pharmacies
 *     responses:
 *       200:
 *         description: Pharmacies du pays
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
 *                     $ref: '#/components/schemas/Pharmacy'
 *
 * /pharmacies/{id}/medicines:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les médicaments d'une pharmacie
 *     tags:
 *       - Pharmacies
 *     responses:
 *       200:
 *         description: Médicaments de la pharmacie
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
 *                     $ref: '#/components/schemas/Medicine'
 */
const router = (0, express_1.Router)();
const pharmacyController = new pharmacy_controller_1.PharmacyController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/pharmacies
 * @description Récupérer toutes les pharmacies avec pagination
 * @access Private
 */
router.get('/', pharmacyController.getAllPharmacies);
/**
 * @route POST /api/v1/pharmacies
 * @description Créer une nouvelle pharmacie (Admin seulement)
 * @access Private/Admin
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createPharmacy), pharmacyController.createPharmacy);
/**
 * @route GET /api/v1/pharmacies/:id
 * @description Récupérer une pharmacie par son ID
 * @access Private
 */
router.get('/:id', pharmacyController.getPharmacyById);
/**
 * @route PUT /api/v1/pharmacies/:id
 * @description Mettre à jour une pharmacie (Admin seulement)
 * @access Private/Admin
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updatePharmacy), pharmacyController.updatePharmacy);
/**
 * @route DELETE /api/v1/pharmacies/:id
 * @description Supprimer une pharmacie (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id', pharmacyController.deletePharmacy);
/**
 * @route GET /api/v1/pharmacies/country/:countryId
 * @description Récupérer les pharmacies d'un pays
 * @access Private
 */
router.get('/country/:countryId', pharmacyController.getPharmaciesByCountry);
/**
 * @route GET /api/v1/pharmacies/:id/medicines
 * @description Récupérer les médicaments d'une pharmacie
 * @access Private
 */
router.get('/:id/medicines', pharmacyController.getPharmacyMedicines);
exports.default = router;
