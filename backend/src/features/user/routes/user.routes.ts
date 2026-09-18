/**
 * @file user.routes.ts
 * @description Routes HTTP Express pour les utilisateurs (/api/v1/users).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getById,
  update,
  remove,
  getProfile,
  uploadAvatar,
} from "../controllers/user.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";
import { uploadAvatarMiddleware } from "../../../core/middlewares/uploads/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.get("/profile/me", getProfile);
router.post("/avatar", uploadAvatarMiddleware, uploadAvatar);
router.get("/", requireRole(["ADMIN"]), getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

export default router;