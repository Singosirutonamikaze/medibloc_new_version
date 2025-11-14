"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_controller_1 = require("../controllers/pharmacy.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_middleware_2 = require("../middleware/validation.middleware");
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
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.createPharmacy), pharmacyController.createPharmacy);
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
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.updatePharmacy), pharmacyController.updatePharmacy);
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
