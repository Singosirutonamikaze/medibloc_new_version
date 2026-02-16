"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
// Types are only used for types, no unused imports
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @route POST /api/v1/auth/register
 * @description Inscription d'un nouvel utilisateur
 * @access Public
 */
router.post('/register', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.register), authController.register);
/**
 * @route POST /api/v1/auth/login
 * @description Connexion d'un utilisateur
 * @access Public
 */
router.post('/login', (0, validation_middleware_1.validationMiddleware)(validation_middleware_1.validationSchemas.login), authController.login);
/**
 * @route GET /api/v1/auth/me
 * @description Récupérer le profil de l'utilisateur connecté
 * @access Private
 */
router.get('/me', auth_middleware_1.authMiddleware, authController.getCurrentUser);
/**
 * @route POST /api/v1/auth/refresh
 * @description Rafraîchir le token JWT
 * @access Private
 */
router.post('/refresh', auth_middleware_1.authMiddleware, authController.refreshToken);
/**
 * @route POST /api/v1/auth/logout
 * @description Déconnexion de l'utilisateur
 * @access Private
 */
router.post('/logout', auth_middleware_1.authMiddleware, authController.logout);
exports.default = router;
