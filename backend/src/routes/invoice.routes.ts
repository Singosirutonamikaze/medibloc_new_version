import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validationMiddleware,
  validationSchemas,
} from "../middleware/validation.middleware";

const router = Router();
const controller = new InvoiceController();

router.use(authMiddleware);

router.get("/", controller.getAllInvoices);

router.post(
  "/",
  validationMiddleware(validationSchemas.createInvoice),
  controller.createInvoice,
);

router.get("/patient/:patientId", controller.getPatientInvoices);

router.get("/:id", controller.getInvoiceById);

router.put(
  "/:id",
  validationMiddleware(validationSchemas.updateInvoice),
  controller.updateInvoice,
);

router.delete("/:id", controller.deleteInvoice);

router.post(
  "/:id/pay",
  validationMiddleware(validationSchemas.createPayment),
  controller.createPayment,
);

export default router;
