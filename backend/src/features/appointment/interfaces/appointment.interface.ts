/**
 * @file appointment.interface.ts
 * @description Contrats d'interfaces et representations pour les rendez-vous medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { AppointmentStatus, Appointment } from "@prisma/client";

/**
 * @interface DetailedAppointment
 * @description Representation enrichie d'un rendez-vous avec les informations du patient et du praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant unique du rendez-vous.
 * @property patientId Identifiant numerique du patient.
 * @property doctorId Identifiant numerique du praticien.
 * @property scheduledAt Date et heure programmees du rendez-vous.
 * @property reason Motif de la consultation medicale.
 * @property notes Remarques cliniques additionnelles.
 * @property status Statut du rendez-vous ({@code PENDING}, {@code CONFIRMED}, {@code CANCELLED}, {@code COMPLETED}).
 * @property createdAt Date d'enregistrement initial.
 * @property updatedAt Date de derniere modification.
 */
export interface DetailedAppointment extends Appointment {
  readonly patient?: {
    readonly id: number;
    readonly user: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
    };
  };
  readonly doctor?: {
    readonly id: number;
    readonly specialty: string | null;
    readonly user: {
      readonly firstName: string;
      readonly lastName: string;
      readonly email: string;
    };
  };
}

export type { Appointment, AppointmentStatus };
