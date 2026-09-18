/**
 * @file notification.routes.ts
 * @description Routes HTTP Express pour les notifications (/api/v1/notifications).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getUserNotifications,
  getById,
  create,
  markAsRead,
  remove,
} from "../controllers/notification.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getUserNotifications);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN"]), create);
router.put("/:id/read", markAsRead);
router.delete("/:id", remove);

export default router;
