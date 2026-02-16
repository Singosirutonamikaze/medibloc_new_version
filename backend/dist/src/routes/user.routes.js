"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authMiddleware);
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
exports.default = router;
