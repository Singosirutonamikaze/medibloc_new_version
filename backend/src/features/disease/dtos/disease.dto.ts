/**
 * @file disease.dto.ts
 * @description Objets de transfert de donnees (DTO) pour la gestion des pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

/**
 * @interface CreateDiseaseDto
 * @description Donnees requises pour l'enregistrement d'une pathologie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property name Designation unique de la maladie.
 * @property description Synthese descriptive des symptomes et effets.
 * @property isViral Origine virale de l'affection.
 * @property isBacterial Origine bacterienne de l'affection.
 * @property isGenetic Origine genetique de l'affection.
 * @property isChronic Caractere chronique de l'affection.
 */
export interface CreateDiseaseDto {
  readonly name: string;
  readonly description?: string;
  readonly isViral?: boolean;
  readonly isBacterial?: boolean;
  readonly isGenetic?: boolean;
  readonly isChronic?: boolean;
}

/**
 * @interface UpdateDiseaseDto
 * @description Donnees modifiables d'une pathologie existante.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateDiseaseDto {
  readonly name?: string;
  readonly description?: string;
  readonly isViral?: boolean;
  readonly isBacterial?: boolean;
  readonly isGenetic?: boolean;
  readonly isChronic?: boolean;
}
