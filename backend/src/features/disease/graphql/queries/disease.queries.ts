/**
 * @file disease.queries.ts
 * @description Requetes GraphQL pour les maladies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Disease } from "@prisma/client";
import {
  findAllDiseases,
  findDiseaseById,
} from "../../services/disease.service";

export const diseasesQuery = async (
  _parent: void
): Promise<Disease[]> => {
  return findAllDiseases();
};

export const diseaseQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Disease> => {
  return findDiseaseById(args.id);
};
