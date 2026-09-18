/**
 * @file disease.interface.ts
 * @description Interfaces metiers pour la feature des maladies et pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Disease as PrismaDisease, DiseaseSymptom, DiseaseCountry } from "@prisma/client";

/**
 * @interface DiseaseWithRelations
 * @description Entite pathologie enrichie de ses symptomes et pays prevalents.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export interface DiseaseWithRelations extends PrismaDisease {
  readonly symptoms?: readonly DiseaseSymptom[];
  readonly prevalentCountries?: readonly DiseaseCountry[];
}
