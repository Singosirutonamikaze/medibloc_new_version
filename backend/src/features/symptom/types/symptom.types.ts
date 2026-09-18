/**
 * @file symptom.types.ts
 * @description Types d'alias pour les symptomes cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Symptom, DiseaseSymptom, Disease } from "@prisma/client";

export type SymptomWithDiseases = Symptom & {
  readonly diseaseSymptoms: (DiseaseSymptom & { disease: Disease })[];
};
