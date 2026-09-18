/**
 * @file symptom.interface.ts
 * @description Interfaces metiers pour les symptomes cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Symptom as PrismaSymptom, DiseaseSymptom } from "@prisma/client";

/**
 * @interface SymptomWithRelations
 * @description Entite symptome enrichie de ses affections liees.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface SymptomWithRelations extends PrismaSymptom {
  readonly diseaseSymptoms?: readonly DiseaseSymptom[];
}
