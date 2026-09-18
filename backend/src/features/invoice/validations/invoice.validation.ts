/**
 * @file invoice.validation.ts
 * @description Schemas de validation pour les factures.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createInvoiceValidationSchema: ValidationSchema = {
  appointmentId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant du rendez-vous est obligatoire et positif",
  },
  patientId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant du patient est obligatoire et positif",
  },
  amount: {
    required: true,
    type: "number",
    min: 0,
    message: "Le montant doit etre positif ou nul",
  },
};
