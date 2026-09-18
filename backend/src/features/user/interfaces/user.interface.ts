/**
 * @file user.interface.ts
 * @description Interfaces pour les comptes utilisateurs, profils complets et avatars.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { User, Role, Patient, Doctor, Admin } from "@prisma/client";

/**
 * @interface UserWithProfiles
 * @description Entite utilisateur complete incluant ses profils specialises.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant numerique unique.
 * @property email Adresse email.
 * @property firstName Prenom.
 * @property lastName Nom de famille.
 * @property role Role fonctionnel.
 * @property avatarUrl URL de l'image de profil.
 * @property isEmailVerified Statut de verification email.
 * @property patientProfile Profil patient lie.
 * @property doctorProfile Profil medecin lie.
 * @property adminProfile Profil administrateur lie.
 */
export interface UserWithProfiles extends User {
  readonly patientProfile?: Patient | null;
  readonly doctorProfile?: Doctor | null;
  readonly adminProfile?: Admin | null;
}

export type { User, Role };
