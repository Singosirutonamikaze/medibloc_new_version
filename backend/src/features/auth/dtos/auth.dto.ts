/**
 * @file auth.dto.ts
 * @description Objets de transfert de donnees (DTO) pour l'inscription et la connexion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Role } from "@prisma/client";

/**
 * @interface RegisterDto
 * @description Donnees requises pour l'enregistrement d'un nouvel utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property email Adresse email unique du compte.
 * @property password Mot de passe en clair (sera hache avant persistance).
 * @property firstName Prenom de l'utilisateur.
 * @property lastName Nom de famille de l'utilisateur.
 * @property role Role initial ({@code PATIENT}, {@code DOCTOR}, {@code ADMIN}).
 */
export interface RegisterDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role?: Role;
}

/**
 * @interface LoginDto
 * @description Donnees requises pour la verification des identifiants de connexion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property email Adresse email du compte.
 * @property password Mot de passe en clair a authentifier.
 */
export interface LoginDto {
  readonly email: string;
  readonly password: string;
}
