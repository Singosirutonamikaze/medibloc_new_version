/**
 * @file patient.routes.ts
 * @description Routes HTTP Express pour la gestion des patients (/api/v1/patients).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getDiseases,
  getAppointments,
  getPrescriptions,
} from "../controllers/patient.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole(["ADMIN", "DOCTOR"]), getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN", "PATIENT"]), create);
router.put("/:id", update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

router.get("/:id/diseases", getDiseases);
router.get("/:id/appointments", getAppointments);
router.get("/:id/prescriptions", getPrescriptions);

export default router;