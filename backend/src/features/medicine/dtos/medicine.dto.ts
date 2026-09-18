/**
 * @file medicine.dto.ts
 * @description Objets de transfert de donnees pour les medicaments et produits pharmaceutiques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { MedicineType } from "@prisma/client";

/**
 * @interface CreateMedicineDto
 * @description Donnees de creation d'un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @property name Nom commercial du medicament.
 * @property type Categorie pharmaceutique (MODERN, TRADITIONAL, ALTERNATIVE).
 * @property description Synthese d'utilisation.
 * @property composition Principes actifs.
 * @property scientificName Nom scientifique botanique ou chimique.
 * @property commonNames Appellations vernaculaires usuelles.
 * @property pharmacyId Identifiant de la pharmacie referencante.
 * @property sideEffects Effets secondaires connus.
 * @property contraindications Contre-indications cliniques.
 */
export interface CreateMedicineDto {
  readonly name: string;
  readonly type: MedicineType;
  readonly description?: string;
  readonly composition?: string;
  readonly scientificName?: string;
  readonly commonNames?: string[];
  readonly pharmacyId?: number;
  readonly sideEffects?: string[];
  readonly contraindications?: string[];
}

/**
 * @interface UpdateMedicineDto
 * @description Donnees de mise a jour d'un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface UpdateMedicineDto {
  readonly name?: string;
  readonly type?: MedicineType;
  readonly description?: string;
  readonly composition?: string;
  readonly scientificName?: string;
  readonly commonNames?: string[];
  readonly pharmacyId?: number;
  readonly sideEffects?: string[];
  readonly contraindications?: string[];
}
