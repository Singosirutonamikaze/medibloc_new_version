import { Router } from 'express';
import { PharmacyController } from '../controllers/pharmacy.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../types';
import { validationSchemas } from '../middleware/validation.middleware';

const router = Router();
const pharmacyController = new PharmacyController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

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
router.post(
  '/',
  validationMiddleware(validationSchemas.createPharmacy),
  pharmacyController.createPharmacy
);

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
router.put(
  '/:id',
  validationMiddleware(validationSchemas.updatePharmacy),
  pharmacyController.updatePharmacy
);

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

export default router;