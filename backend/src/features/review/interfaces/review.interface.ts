/**
 * @file review.interface.ts
 * @description Interfaces pour les avis medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Review as PrismaReview, Doctor, Patient, Appointment } from "@prisma/client";

export interface ReviewWithRelations extends PrismaReview {
  readonly doctor?: Doctor;
  readonly patient?: Patient;
  readonly appointment?: Appointment;
}
