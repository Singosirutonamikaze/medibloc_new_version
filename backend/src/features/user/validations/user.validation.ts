/**
 * @file user.validation.ts
 * @description Schemas de validation pour les mises a jour de profil utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const updateUserValidationSchema: ValidationSchema = {
  firstName: {
    type: "string",
    minLength: 1,
    message: "Le prenom ne peut pas etre vide",
  },
  lastName: {
    type: "string",
    minLength: 1,
    message: "Le nom de famille ne peut pas etre vide",
  },
};
