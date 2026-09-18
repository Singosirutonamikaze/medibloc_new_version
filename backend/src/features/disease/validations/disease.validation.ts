/**
 * @file disease.validation.ts
 * @description Schemas de validation pour les pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createDiseaseValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Le nom de la maladie est obligatoire et doit comporter au moins 2 caracteres",
  },
};
