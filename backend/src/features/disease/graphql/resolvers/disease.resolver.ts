/**
 * @file disease.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine des pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { diseasesQuery, diseaseQuery } from "../queries/disease.queries";
import {
  createDiseaseMutation,
  updateDiseaseMutation,
  deleteDiseaseMutation,
} from "../mutations/disease.mutations";

export const diseaseResolvers = {
  Query: {
    diseases: diseasesQuery,
    disease: diseaseQuery,
  },
  Mutation: {
    createDisease: createDiseaseMutation,
    updateDisease: updateDiseaseMutation,
    deleteDisease: deleteDiseaseMutation,
  },
};

export default diseaseResolvers;
