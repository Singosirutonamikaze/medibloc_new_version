/**
 * @file patient.interface.ts
 * @description Interfaces et types enrichis pour le profil et les donnees cliniques du patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Patient, Gender, User, PatientDisease, Disease, Appointment, Prescription } from "@prisma/client";

/**
 * @interface DetailedPatient
 * @description Profil complet d'un patient integrant ses informations d'identite utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant unique de l'entite patient.
 * @property userId Identifiant de liaison vers le compte utilisateur {@link User}.
 * @property birthDate Date de naissance du patient.
 * @property gender Genre biologique ({@code MALE}, {@code FEMALE}, {@code OTHER}).
 * @property phone Numero de telephone de contact.
 * @property address Adresse de residence.
 * @property user Objet utilisateur contenant nom, prenom et email.
 */
export interface DetailedPatient extends Patient {
  readonly user?: {
    readonly id: number;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly avatarUrl: string | null;
  };
  readonly diseases?: (PatientDisease & { readonly disease: Disease })[];
  readonly appointments?: Appointment[];
  readonly prescriptions?: Prescription[];
}

export type { Patient, Gender };
