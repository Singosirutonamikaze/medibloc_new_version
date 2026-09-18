/**
 * @file symptom.validation.ts
 * @description Regles de validation pour les symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createSymptomValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Le nom du symptome est obligatoire et doit comporter au moins 2 caracteres",
  },
};
