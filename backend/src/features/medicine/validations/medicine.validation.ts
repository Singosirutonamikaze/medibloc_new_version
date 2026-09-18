/**
 * @file medicine.validation.ts
 * @description Schemas de validation pour les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createMedicineValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Le nom du medicament est obligatoire et doit comporter au moins 2 caracteres",
  },
  type: {
    required: true,
    type: "string",
    message: "Le type de medicament est obligatoire (MODERN, TRADITIONAL, ALTERNATIVE)",
  },
};
