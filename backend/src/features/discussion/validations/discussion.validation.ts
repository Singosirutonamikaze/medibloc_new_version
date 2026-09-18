/**
 * @file discussion.validation.ts
 * @description Schemas de validation pour les discussions et messages.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createDiscussionValidationSchema: ValidationSchema = {
  patientId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant patient est obligatoire et positif",
  },
  doctorId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant medecin est obligatoire et positif",
  },
};
