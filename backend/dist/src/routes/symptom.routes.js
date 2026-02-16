"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const symptom_controller_1 = require("../controllers/symptom.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const symptomController = new symptom_controller_1.SymptomController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/symptoms
 * @description Récupérer tous les symptômes avec pagination
 * @access Private
 */
router.get('/', symptomController.getAllSymptoms);
/**
 * @route POST /api/v1/symptoms
 * @description Créer un nouveau symptôme (Admin seulement)
 * @access Private/Admin
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createSymptom), symptomController.createSymptom);
/**
 * @route GET /api/v1/symptoms/:id
 * @description Récupérer un symptôme par son ID
 * @access Private
 */
router.get('/:id', symptomController.getSymptomById);
/**
 * @route PUT /api/v1/symptoms/:id
 * @description Mettre à jour un symptôme (Admin seulement)
 * @access Private/Admin
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateSymptom), symptomController.updateSymptom);
/**
 * @route DELETE /api/v1/symptoms/:id
 * @description Supprimer un symptôme (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id', symptomController.deleteSymptom);
/**
 * @route GET /api/v1/symptoms/:id/diseases
 * @description Récupérer les maladies associées à un symptôme
 * @access Private
 */
router.get('/:id/diseases', symptomController.getSymptomDiseases);
exports.default = router;
