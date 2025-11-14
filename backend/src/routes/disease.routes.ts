import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateDiseaseDto, UpdateDiseaseDto } from '../types';
import { validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const diseaseController = new DiseaseController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createDisease),
  diseaseController.createDisease
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updateDisease),
  diseaseController.updateDisease
);

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

export default router;