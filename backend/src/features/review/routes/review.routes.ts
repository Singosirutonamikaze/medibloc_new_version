/**
 * @file review.routes.ts
 * @description Routes HTTP Express pour les evaluations (/api/v1/reviews).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getDoctorReviews,
  getById,
  create,
  remove,
} from "../controllers/review.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/doctor/:doctorId", getDoctorReviews);
router.get("/:id", getById);
router.post("/", requireRole(["PATIENT"]), create);
router.delete("/:id", requireRole(["ADMIN"]), remove);

export default router;
