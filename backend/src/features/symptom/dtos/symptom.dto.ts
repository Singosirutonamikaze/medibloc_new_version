/**
 * @file symptom.dto.ts
 * @description Objets de transfert de donnees pour la gestion des symptomes cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @interface CreateSymptomDto
 * @description Donnees de creation d'un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property name Designation du symptome.
 * @property description Details des manifestations cliniques.
 */
export interface CreateSymptomDto {
  readonly name: string;
  readonly description?: string;
}

/**
 * @interface UpdateSymptomDto
 * @description Donnees de mise a jour d'un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateSymptomDto {
  readonly name?: string;
  readonly description?: string;
}
