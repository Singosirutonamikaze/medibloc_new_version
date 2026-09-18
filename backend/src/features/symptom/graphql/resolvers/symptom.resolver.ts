/**
 * @file symptom.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour les symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { symptomsQuery, symptomQuery } from "../queries/symptom.queries";
import {
  createSymptomMutation,
  updateSymptomMutation,
  deleteSymptomMutation,
} from "../mutations/symptom.mutations";

export const symptomResolvers = {
  Query: {
    symptoms: symptomsQuery,
    symptom: symptomQuery,
  },
  Mutation: {
    createSymptom: createSymptomMutation,
    updateSymptom: updateSymptomMutation,
    deleteSymptom: deleteSymptomMutation,
  },
};

export default symptomResolvers;
