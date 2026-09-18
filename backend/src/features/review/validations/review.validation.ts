/**
 * @file review.validation.ts
 * @description Schemas de validation pour les evaluations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createReviewValidationSchema: ValidationSchema = {
  appointmentId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant du rendez-vous est obligatoire et positif",
  },
  rating: {
    required: true,
    type: "number",
    min: 1,
    max: 5,
    message: "La note doit etre comprise entre 1 et 5",
  },
};
