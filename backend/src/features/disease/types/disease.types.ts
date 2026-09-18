/**
 * @file disease.types.ts
 * @description Types d'alias et declarations complementaires pour le domaine des maladies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Disease, DiseaseSymptom, Symptom, Country } from "@prisma/client";

/**
 * @typedef DiseaseWithDetails
 * @description Type representant une pathologie avec ses relations chargees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export type DiseaseWithDetails = Disease & {
  readonly symptoms: (DiseaseSymptom & { symptom: Symptom })[];
  readonly prevalentCountries: { country: Country }[];
};
