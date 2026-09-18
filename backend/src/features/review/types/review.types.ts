/**
 * @file review.types.ts
 * @description Types d'alias pour les avis.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Review, Doctor, Patient, Appointment, User } from "@prisma/client";

export type ReviewFull = Review & {
  readonly doctor: Doctor & { user: User };
  readonly patient: Patient & { user: User };
  readonly appointment: Appointment;
};
