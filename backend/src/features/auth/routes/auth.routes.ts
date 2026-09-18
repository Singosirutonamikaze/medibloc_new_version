/**
 * @file auth.routes.ts
 * @description Definition des routes HTTP Express pour l'authentification (/api/v1/auth).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

export default router;
