/**
 * @file medical-record.routes.ts
 * @description Routes HTTP Express pour les dossiers medicaux (/api/v1/medical-records).
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
} from "../controllers/medical-record.controller";
import { authMiddleware, requireRole } from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/patient/:patientId", getByPatient);
router.get("/", requireRole(["ADMIN", "DOCTOR"]), getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN", "DOCTOR"]), create);
router.put("/:id", requireRole(["ADMIN", "DOCTOR"]), update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

export default router;