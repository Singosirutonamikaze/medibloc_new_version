/**
 * @file doctor.interface.ts
 * @description Interfaces et types pour les medecins praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Doctor, User, Availability, TimeOff, Appointment, Prescription } from "@prisma/client";

/**
 * @interface DetailedDoctor
 * @description Profil detaille d'un medecin integrant identite, disponibilites et conges.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DetailedDoctor extends Doctor {
  readonly user?: {
    readonly id: number;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl: string | null;
  };
  readonly availabilities?: Availability[];
  readonly timeOffs?: TimeOff[];
  readonly appointments?: Appointment[];
  readonly prescriptions?: Prescription[];
}

export type { Doctor };
