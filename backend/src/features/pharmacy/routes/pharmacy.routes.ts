/**
 * @file pharmacy.routes.ts
 * @description Routes HTTP Express pour les pharmacies (/api/v1/pharmacies).
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Router } from "express";
import {
  getAll,
  getById,
  getByCountry,
  create,
  update,
  remove,
  getMedicines,
} from "../controllers/pharmacy.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/country/:countryId", getByCountry);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN"]), create);
router.put("/:id", requireRole(["ADMIN"]), update);
router.delete("/:id", requireRole(["ADMIN"]), remove);
router.get("/:id/medicines", getMedicines);

export default router;