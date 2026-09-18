/**
 * @file prescription.validation.ts
 * @description Schemas de validation pour les ordonnances medicales.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createPrescriptionValidationSchema: ValidationSchema = {
  doctorId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant medecin est obligatoire et positif",
  },
  patientId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant patient est obligatoire et positif",
  },
  medications: {
    required: true,
    type: "string",
    minLength: 3,
    message: "La prescription de medicaments doit comporter au moins 3 caracteres",
  },
};
