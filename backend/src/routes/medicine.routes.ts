import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const medicineController = new MedicineController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createMedicine),
  medicineController.createMedicine
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateMedicine),
  medicineController.updateMedicine
);

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

export default router;