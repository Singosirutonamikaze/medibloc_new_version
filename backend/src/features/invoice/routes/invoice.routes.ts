/**
 * @file invoice.routes.ts
 * @description Routes HTTP Express pour les factures (/api/v1/invoices).
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
  recordPayment,
} from "../controllers/invoice.controller";
import {
  authMiddleware,
  requireRole,
} from "../../../core/middlewares/auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireRole(["ADMIN", "DOCTOR"]), create);
router.put("/:id", requireRole(["ADMIN"]), update);
router.delete("/:id", requireRole(["ADMIN"]), remove);
router.post("/:id/payments", recordPayment);

export default router;
