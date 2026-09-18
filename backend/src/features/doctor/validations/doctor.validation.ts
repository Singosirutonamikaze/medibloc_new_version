/**
 * @file doctor.validation.ts
 * @description Schemas de validation pour les requetes liees aux praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createDoctorValidationSchema: ValidationSchema = {
  userId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant utilisateur est obligatoire et positif",
  },
  specialty: {
    type: "string",
    minLength: 2,
    message: "La specialite doit comporter au moins 2 caracteres",
  },
  phone: {
    type: "string",
    minLength: 6,
    message: "Le numero de telephone professionnel doit comporter au moins 6 caracteres",
  },
};
