/**
 * @file medicine.queries.ts
 * @description Requetes GraphQL pour les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Medicine } from "@prisma/client";
import {
  findAllMedicines,
  findMedicineById,
} from "../../services/medicine.service";

export const medicinesQuery = async (
  _parent: void
): Promise<Medicine[]> => {
  return findAllMedicines();
};

export const medicineQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Medicine> => {
  return findMedicineById(args.id);
};
