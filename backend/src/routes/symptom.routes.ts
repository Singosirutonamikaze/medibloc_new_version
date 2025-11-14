import { Router } from 'express';
import { SymptomController } from '../controllers/symptom.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';
import { CreateSymptomDto, UpdateSymptomDto } from '../types';

const router = Router();
const symptomController = new SymptomController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createSymptom),
  symptomController.createSymptom
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateSymptom),
  symptomController.updateSymptom
);

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

export default router;