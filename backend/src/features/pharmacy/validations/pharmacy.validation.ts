/**
 * @file pharmacy.validation.ts
 * @description Regles de validation des pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createPharmacyValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Le nom de la pharmacie est obligatoire",
  },
  address: {
    required: true,
    type: "string",
    message: "L'adresse est obligatoire",
  },
  city: {
    required: true,
    type: "string",
    message: "La ville est obligatoire",
  },
  countryId: {
    required: true,
    type: "number",
    min: 1,
    message: "L'identifiant du pays est obligatoire et positif",
  },
};
