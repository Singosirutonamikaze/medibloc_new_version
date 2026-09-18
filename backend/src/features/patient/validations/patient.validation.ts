/**
 * @file patient.validation.ts
 * @description Schemas de validation pour les profils patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createPatientValidationSchema: ValidationSchema = {
  userId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant utilisateur est obligatoire et positif",
  },
  birthDate: {
    type: "date",
    message: "La date de naissance doit etre une date valide",
  },
  phone: {
    type: "string",
    minLength: 6,
    message: "Le numero de telephone doit comporter au moins 6 caracteres",
  },
};
