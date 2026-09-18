/**
 * @file appointment.validation.ts
 * @description Regles de validation des requetes de creation et modification de rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { ValidationSchema } from "../../../core/middlewares/validations/validation.middleware";

export const createAppointmentValidationSchema: ValidationSchema = {
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
    message: "L'identifiant docteur est obligatoire et positif",
  },
  scheduledAt: {
    required: true,
    type: "date",
    message: "La date de rendez-vous doit etre une date valide",
  },
  reason: {
    type: "string",
    minLength: 3,
    message: "Le motif doit comporter au moins 3 caracteres",
  },
};
