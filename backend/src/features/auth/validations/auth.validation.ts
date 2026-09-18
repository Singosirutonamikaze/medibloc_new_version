/**
 * @file auth.validation.ts
 * @description Schemas de validation pour les requetes de creation de compte et d'authentification.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const registerValidationSchema: ValidationSchema = {
  email: {
    required: true,
    type: "email",
    message: "Une adresse email valide est obligatoire",
  },
  password: {
    required: true,
    type: "string",
    minLength: 6,
    message: "Le mot de passe doit comporter au minimum 6 caracteres",
  },
  firstName: {
    required: true,
    type: "string",
    minLength: 1,
    message: "Le prenom est obligatoire",
  },
  lastName: {
    required: true,
    type: "string",
    minLength: 1,
    message: "Le nom de famille est obligatoire",
  },
};

export const loginValidationSchema: ValidationSchema = {
  email: {
    required: true,
    type: "email",
    message: "Une adresse email valide est obligatoire",
  },
  password: {
    required: true,
    type: "string",
    minLength: 1,
    message: "Le mot de passe est obligatoire",
  },
};
