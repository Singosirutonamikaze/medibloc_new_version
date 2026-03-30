import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UploadController } from '../controllers/upload.controller';
import { uploadAvatarMiddleware } from '../middleware/upload.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags:
 *       - Users
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [PATIENT, DOCTOR, PHARMACY, ADMIN]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *                     $ref: '#/components/schemas/User'
 *
 * /users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *
 * /users/profile/me:
 *   get:
 *     summary: Récupérer le profil complet de l'utilisateur connecté
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const router = Router();
const userController = new UserController();
const uploadController = new UploadController();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/**
 * @route GET /api/v1/users
 * @description Récupérer tous les utilisateurs (Admin seulement)
 * @access Private/Admin
 */
router.get('/', userController.getAllUsers);

/**
 * @route GET /api/v1/users/:id
 * @description Récupérer un utilisateur par son ID
 * @access Private
 */
router.get('/:id', userController.getUserById);

/**
 * @route PUT /api/v1/users/:id
 * @description Mettre à jour un utilisateur
 * @access Private
 */
router.put('/:id', userController.updateUser);

/**
 * @route DELETE /api/v1/users/:id
 * @description Supprimer un utilisateur (Admin seulement)
 * @access Private/Admin
 */
router.delete('/:id', userController.deleteUser);

/**
 * @route GET /api/v1/users/profile/me
 * @description Récupérer le profil complet de l'utilisateur connecté
 * @access Private
 */
router.get('/profile/me', userController.getUserProfile);

/**
 * @route POST /api/v1/users/:id/avatar
 * @description Upload d'une photo de profil (max 2 Mo, images seulement)
 * @access Private
 */
router.post('/:id/avatar', (req, res, next) => {
  uploadAvatarMiddleware(req, res, (err) => {
    if (err) {
      return res.status(err.message.includes('File too large') ? 413 : 400).json({
        success: false,
        error: err.message.includes('File too large')
          ? 'Fichier trop volumineux. Maximum autorisé : 2 Mo'
          : err.message,
      });
    }
    next();
  });
}, uploadController.uploadAvatar);

/**
 * @route DELETE /api/v1/users/:id/avatar
 * @description Supprimer la photo de profil
 * @access Private
 */
router.delete('/:id/avatar', uploadController.deleteAvatar);

export default router;