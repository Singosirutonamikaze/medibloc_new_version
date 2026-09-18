/**
 * @file medicine.mutations.ts
 * @description Mutations GraphQL pour les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Medicine } from "@prisma/client";
import {
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../services/medicine.service";
import { CreateMedicineDto, UpdateMedicineDto } from "../../dtos/medicine.dto";

export const createMedicineMutation = async (
  _parent: void,
  args: { input: CreateMedicineDto }
): Promise<Medicine> => {
  return createMedicine(args.input);
};

export const updateMedicineMutation = async (
  _parent: void,
  args: { id: number; input: UpdateMedicineDto }
): Promise<Medicine> => {
  return updateMedicine(args.id, args.input);
};

export const deleteMedicineMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Medicine> => {
  return deleteMedicine(args.id);
};
