/**
 * @file appointment.routes.ts
 * @description Definition des routes HTTP Express pour les rendez-vous (/api/v1/appointments).
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
  changeStatus,
  getByPatient,
  getByDoctor,
} from "../controllers/appointment.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/patient/:patientId", getByPatient);
router.get("/doctor/:doctorId", getByDoctor);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.patch("/:id/status", changeStatus);
router.delete("/:id", requireRole(["ADMIN", "DOCTOR", "PATIENT"]), remove);

export default router;