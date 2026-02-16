import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';
// Types are only used for types, no unused imports
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                 message:
 *                   type: string
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token JWT
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token rafraîchi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       501:
 *         description: Non implémenté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Demande invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const router = Router();
const authController = new AuthController();

/**
 * @route POST /api/v1/auth/register
 * @description Inscription d'un nouvel utilisateur
 * @access Public
 */
router.post(
  '/register',
  validationMiddleware(validationSchemas.register),
  authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @description Connexion d'un utilisateur
 * @access Public
 */
router.post(
  '/login',
  validationMiddleware(validationSchemas.login),
  authController.login
);

/**
 * @route GET /api/v1/auth/me
 * @description Récupérer le profil de l'utilisateur connecté
 * @access Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route POST /api/v1/auth/refresh
 * @description Rafraîchir le token JWT
 * @access Private
 */
router.post('/refresh', authMiddleware, authController.refreshToken);

/**
 * @route POST /api/v1/auth/logout
 * @description Déconnexion de l'utilisateur
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

export default router;