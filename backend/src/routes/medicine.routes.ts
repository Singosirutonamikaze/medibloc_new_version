import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';

/**
 * @openapi
 * /medicines:
 *   get:
 *     summary: Récupérer tous les médicaments
 *     tags:
 *       - Medicines
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
 *         description: Liste des médicaments
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
 *   post:
 *     summary: Créer un nouveau médicament
 *     tags:
 *       - Medicines
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *               pharmacyId:
 *                 type: integer
 *             required: [name, dosage, price, pharmacyId]
 *     responses:
 *       201:
 *         description: Médicament créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /medicines/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer un médicament par son ID
 *     tags:
 *       - Medicines
 *     responses:
 *       200:
 *         description: Médicament trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Medicine'
 *       404:
 *         description: Médicament non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un médicament
 *     tags:
 *       - Medicines
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: Médicament mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Medicine'
 *       404:
 *         description: Médicament non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un médicament
 *     tags:
 *       - Medicines
 *     responses:
 *       200:
 *         description: Médicament supprimé
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
 *         description: Médicament non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /medicines/type/{type}:
 *   parameters:
 *     - in: path
 *       name: type
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     summary: Récupérer les médicaments par type
 *     tags:
 *       - Medicines
 *     responses:
 *       200:
 *         description: Médicaments du type
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
 *
 * /medicines/pharmacy/{pharmacyId}:
 *   parameters:
 *     - in: path
 *       name: pharmacyId
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer les médicaments d'une pharmacie
 *     tags:
 *       - Medicines
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