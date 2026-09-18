/**
 * @file patient.dto.ts
 * @description Objets de transfert de donnees pour la creation et mise a jour de profils patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Gender } from "@prisma/client";

/**
 * @interface CreatePatientDto
 * @description Donnees de creation d'un profil patient associe a un compte utilisateur existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property userId Identifiant de l'utilisateur.
 * @property birthDate Date de naissance.
 * @property gender Genre biologique.
 * @property phone Numero de telephone.
 * @property address Adresse physique.
 */
export interface CreatePatientDto {
  readonly userId: number;
  readonly birthDate?: string | Date;
  readonly gender?: Gender;
  readonly phone?: string;
  readonly address?: string;
}

/**
 * @interface UpdatePatientDto
 * @description Donnees de mise a jour d'un profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdatePatientDto {
  readonly birthDate?: string | Date;
  readonly gender?: Gender;
  readonly phone?: string;
  readonly address?: string;
}
