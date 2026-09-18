/**
 * @file medical-record.dto.ts
 * @description Objets de transfert de donnees pour la redaction et mise a jour des dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @interface CreateMedicalRecordDto
 * @description Donnees de creation d'une nouvelle observation medicale.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property patientId Identifiant numerique du patient concerne.
 * @property title Titre de l'observation.
 * @property content Compte-rendu clinique complet.
 * @property files Liste optionnelle des pieces jointes.
 */
export interface CreateMedicalRecordDto {
  readonly patientId: number;
  readonly title: string;
  readonly content: string;
  readonly files?: string[];
}

/**
 * @interface UpdateMedicalRecordDto
 * @description Donnees modifiables sur une observation existante.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateMedicalRecordDto {
  readonly title?: string;
  readonly content?: string;
  readonly files?: string[];
}
