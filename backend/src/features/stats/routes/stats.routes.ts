/**
 * @file stats.routes.ts
 * @description Routes HTTP Express pour les statistiques (/api/v1/stats).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getOverview,
  getDiseaseStats,
  getAppointmentStats,
  getPatientStats,
} from "../controllers/stats.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/overview", requireRole(["ADMIN"]), getOverview);
router.get("/dashboard", requireRole(["ADMIN"]), getOverview);
router.get("/diseases", requireRole(["ADMIN"]), getDiseaseStats);
router.get("/appointments", requireRole(["ADMIN"]), getAppointmentStats);
router.get("/patients", requireRole(["ADMIN"]), getPatientStats);

export default router;