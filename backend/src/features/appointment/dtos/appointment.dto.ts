/**
 * @file appointment.dto.ts
 * @description Objets de transfert de donnees pour la reservation, mise a jour et filtrage des rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { AppointmentStatus } from "@prisma/client";

/**
 * @interface CreateAppointmentDto
 * @description Donnees necessaires a la prise d'un nouveau rendez-vous medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property patientId Identifiant numerique unique du patient.
 * @property doctorId Identifiant numerique unique du praticien.
 * @property scheduledAt Date et heure prevues au format ISO ou Date.
 * @property reason Motif explicite de la consultation.
 * @property notes Remarques ou consignes pre-consultation.
 */
export interface CreateAppointmentDto {
  readonly patientId: number;
  readonly doctorId: number;
  readonly scheduledAt: string | Date;
  readonly reason?: string;
  readonly notes?: string;
}

/**
 * @interface UpdateAppointmentDto
 * @description Donnees de modification d'un rendez-vous existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property scheduledAt Nouvel horaire planifie.
 * @property reason Motif modifie.
 * @property notes Notes de suivi mises a jour.
 * @property status Nouveau statut de la consultation.
 */
export interface UpdateAppointmentDto {
  readonly scheduledAt?: string | Date;
  readonly reason?: string;
  readonly notes?: string;
  readonly status?: AppointmentStatus;
}
