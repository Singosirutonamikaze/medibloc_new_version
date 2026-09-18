/**
 * @file medical-record.validation.ts
 * @description Schemas de validation pour les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createMedicalRecordValidationSchema: ValidationSchema = {
  patientId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant patient est obligatoire et positif",
  },
  title: {
    required: true,
    type: "string",
    minLength: 3,
    message: "Le titre doit comporter au moins 3 caracteres",
  },
  content: {
    required: true,
    type: "string",
    minLength: 5,
    message: "Le contenu medical doit comporter au moins 5 caracteres",
  },
};
