"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disease_controller_1 = require("../controllers/disease.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_middleware_2 = require("../middleware/validation.middleware");
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
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.createDisease), diseaseController.createDisease);
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
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_2.validationSchemas.updateDisease), diseaseController.updateDisease);
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
