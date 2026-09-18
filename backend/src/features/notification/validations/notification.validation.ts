/**
 * @file notification.validation.ts
 * @description Schemas de validation pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createNotificationValidationSchema: ValidationSchema = {
  userId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant utilisateur est obligatoire et positif",
  },
  title: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Le titre est obligatoire",
  },
};
