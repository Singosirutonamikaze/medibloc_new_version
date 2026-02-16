"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicine_controller_1 = require("../controllers/medicine.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const medicineController = new medicine_controller_1.MedicineController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
/**
 * @route GET /api/v1/medicines
 * @description Récupérer tous les médicaments avec filtres
 * @access Private
 */
router.get('/', medicineController.getAllMedicines);
/**
 * @route POST /api/v1/medicines
 * @description Créer un nouveau médicament (Admin seulement)
 * @access Private/Admin
 */
router.post('/', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.createMedicine), medicineController.createMedicine);
/**
 * @route GET /api/v1/medicines/:id
 * @description Récupérer un médicament par son ID
 * @access Private
 */
router.get('/:id', medicineController.getMedicineById);
/**
 * @route PUT /api/v1/medicines/:id
 * @description Mettre à jour un médicament (Admin seulement)
 * @access Private/Admin
 */
router.put('/:id', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.updateMedicine), medicineController.updateMedicine);
/**
 * @route DELETE /api/v1/medicines/:id
 * @description Supprimer un médicament (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id', medicineController.deleteMedicine);
/**
 * @route GET /api/v1/medicines/type/:type
 * @description Récupérer les médicaments par type
 * @access Private
 */
router.get('/type/:type', medicineController.getMedicinesByType);
/**
 * @route GET /api/v1/medicines/pharmacy/:pharmacyId
 * @description Récupérer les médicaments d'une pharmacie
 * @access Private
 */
router.get('/pharmacy/:pharmacyId', medicineController.getMedicinesByPharmacy);
exports.default = router;
