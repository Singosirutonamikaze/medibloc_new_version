/**
 * @file user.dto.ts
 * @description Objets de transfert de donnees pour la gestion des utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Role } from "@prisma/client";

/**
 * @interface UpdateUserDto
 * @description Donnees modifiables sur le profil utilisateur.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property firstName Prenom modifie.
 * @property lastName Nom de famille modifie.
 * @property role Role systeme modifie (reserve a l'administrateur).
 * @property avatarUrl URL ou chemin d'avatar mis a jour.
 */
export interface UpdateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly role?: Role;
  readonly avatarUrl?: string;
}
