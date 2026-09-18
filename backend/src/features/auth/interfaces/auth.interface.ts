/**
 * @file auth.interface.ts
 * @description Interfaces et contrats de typage pour le domaine de l'authentification et de la gestion de sessions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Role } from "@prisma/client";

/**
 * @interface SafeUser
 * @description Representation publique securisee d'un utilisateur, exempte de tout mot de passe ou secret 2FA.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant numerique unique de l'utilisateur.
 * @property email Adresse email verifiee ou declaree.
 * @property firstName Prenom de l'utilisateur.
 * @property lastName Nom de famille de l'utilisateur.
 * @property role Role systeme ({@code PATIENT}, {@code DOCTOR}, {@code ADMIN}).
 * @property avatarUrl Chemin ou URL de l'image de profil.
 * @property isEmailVerified Etat de confirmation de l'adresse email.
 * @property createdAt Date d'inscription.
 * @property updatedAt Date de derniere mise a jour.
 */
export interface SafeUser {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
  readonly avatarUrl: string | null;
  readonly isEmailVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * @interface AuthResult
 * @description Contrat de retour lors d'une authentification ou inscription reussie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property user Profil public de l'utilisateur.
 * @property token Jeton JWT d'acces signe.
 */
export interface AuthResult {
  readonly user: SafeUser;
  readonly token: string;
}

/**
 * @interface TokenPayload
 * @description Charge utile encodee dans le jeton d'authentification JWT.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property id Identifiant numerique de l'utilisateur.
 * @property email Adresse email de l'utilisateur.
 * @property role Role fonctionnel.
 */
export interface TokenPayload {
  readonly id: number;
  readonly email: string;
  readonly role: Role;
}
