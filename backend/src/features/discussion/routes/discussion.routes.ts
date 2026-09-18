/**
 * @file discussion.routes.ts
 * @description Routes HTTP Express pour la messagerie (/api/v1/discussions).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getById,
  getOrCreate,
  getMessages,
  createMessage,
  markAsRead,
} from "../controllers/discussion.controller";
import { authMiddleware } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.post("/get-or-create", getOrCreate);
router.get("/:id", getById);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", createMessage);
router.put("/:id/read", markAsRead);

export default router;
