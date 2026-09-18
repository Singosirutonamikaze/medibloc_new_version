/**
 * @file prescription.routes.ts
 * @description Routes HTTP Express pour les ordonnances (/api/v1/prescriptions).
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
  getByPatient,
  getByDoctor,
} from "../controllers/prescription.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/patient/:patientId", getByPatient);
router.get("/doctor/:doctorId", getByDoctor);
router.get("/", requireRole(["ADMIN", "DOCTOR"]), getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN", "DOCTOR"]), create);
router.put("/:id", requireRole(["ADMIN", "DOCTOR"]), update);
router.delete("/:id", requireRole(["ADMIN", "DOCTOR"]), remove);

export default router;