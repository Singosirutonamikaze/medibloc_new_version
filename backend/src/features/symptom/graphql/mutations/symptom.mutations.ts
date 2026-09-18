/**
 * @file symptom.mutations.ts
 * @description Mutations GraphQL pour la gestion des symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Symptom } from "@prisma/client";
import {
  createSymptom,
  updateSymptom,
  deleteSymptom,
} from "../../services/symptom.service";
import { CreateSymptomDto, UpdateSymptomDto } from "../../dtos/symptom.dto";

export const createSymptomMutation = async (
  _parent: void,
  args: { input: CreateSymptomDto }
): Promise<Symptom> => {
  return createSymptom(args.input);
};

export const updateSymptomMutation = async (
  _parent: void,
  args: { id: number; input: UpdateSymptomDto }
): Promise<Symptom> => {
  return updateSymptom(args.id, args.input);
};

export const deleteSymptomMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Symptom> => {
  return deleteSymptom(args.id);
};
