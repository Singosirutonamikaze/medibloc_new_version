/**
 * @file disease.mutations.ts
 * @description Mutations GraphQL pour la gestion des pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Disease } from "@prisma/client";
import {
  createDisease,
  updateDisease,
  deleteDisease,
} from "../../services/disease.service";
import { CreateDiseaseDto, UpdateDiseaseDto } from "../../dtos/disease.dto";

export const createDiseaseMutation = async (
  _parent: void,
  args: { input: CreateDiseaseDto }
): Promise<Disease> => {
  return createDisease(args.input);
};

export const updateDiseaseMutation = async (
  _parent: void,
  args: { id: number; input: UpdateDiseaseDto }
): Promise<Disease> => {
  return updateDisease(args.id, args.input);
};

export const deleteDiseaseMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Disease> => {
  return deleteDisease(args.id);
};
