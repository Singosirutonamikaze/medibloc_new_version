/**
 * @file disease.routes.ts
 * @description Routes HTTP Express pour le domaine des pathologies (/api/v1/diseases).
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
  getSymptoms,
  getCountries,
  addSymptom,
  removeSymptom,
} from "../controllers/disease.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN"]), create);
router.put("/:id", requireRole(["ADMIN"]), update);
router.delete("/:id", requireRole(["ADMIN"]), remove);

router.get("/:id/symptoms", getSymptoms);
router.get("/:id/countries", getCountries);
router.post("/:id/symptoms/:symptomId", requireRole(["ADMIN"]), addSymptom);
router.delete(
  "/:id/symptoms/:symptomId",
  requireRole(["ADMIN"]),
  removeSymptom
);

export default router;