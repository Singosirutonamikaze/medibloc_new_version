/**
 * @file symptom.routes.ts
 * @description Routes HTTP Express pour les symptomes (/api/v1/symptoms).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getById,
  getDiseases,
  create,
  update,
  remove,
} from "../controllers/symptom.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/:id", getById);
router.get("/:id/diseases", getDiseases);
router.post("/", requireRole(["ADMIN"]), create);
router.put("/:id", requireRole(["ADMIN"]), update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

export default router;
