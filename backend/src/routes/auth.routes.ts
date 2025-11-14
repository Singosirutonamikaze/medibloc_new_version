import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware, validationSchemas } from '../middleware/validation.middleware';
import { LoginDto, RegisterUserDto } from '../types';
import { authMiddleware } from '../middleware/auth.middleware';

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