/**
 * @file symptom.queries.ts
 * @description Requetes GraphQL pour les symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Symptom } from "@prisma/client";
import {
  findAllSymptoms,
  findSymptomById,
} from "../../services/symptom.service";

export const symptomsQuery = async (
  _parent: void
): Promise<Symptom[]> => {
  return findAllSymptoms();
};

export const symptomQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Symptom> => {
  return findSymptomById(args.id);
};
