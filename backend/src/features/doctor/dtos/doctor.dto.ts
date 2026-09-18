/**
 * @file doctor.dto.ts
 * @description Objets de transfert de donnees pour les praticiens et medecins.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @interface CreateDoctorDto
 * @description Donnees pour la creation d'un profil praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property userId Identifiant du compte utilisateur associe.
 * @property specialty Specialite medicale principale (ex: {@code "Cardiologie"}).
 * @property phone Numero de telephone professionnel.
 */
export interface CreateDoctorDto {
  readonly userId: number;
  readonly specialty?: string;
  readonly phone?: string;
}

/**
 * @interface UpdateDoctorDto
 * @description Donnees pour la mise a jour d'un profil praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateDoctorDto {
  readonly specialty?: string;
  readonly phone?: string;
}
