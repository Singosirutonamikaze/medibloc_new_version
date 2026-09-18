/**
 * @file doctor.routes.ts
 * @description Routes HTTP Express pour les praticiens (/api/v1/doctors).
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
  getSpecialties,
  getAppointments,
  getPrescriptions,
} from "../controllers/doctor.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/specialties", getSpecialties);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN"]), create);
router.put("/:id", update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

router.get("/:id/appointments", getAppointments);
router.get("/:id/prescriptions", getPrescriptions);

export default router;