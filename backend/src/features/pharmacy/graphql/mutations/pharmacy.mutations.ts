/**
 * @file pharmacy.mutations.ts
 * @description Mutations GraphQL pour les officines de pharmacie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Pharmacy } from "@prisma/client";
import {
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} from "../../services/pharmacy.service";
import { CreatePharmacyDto, UpdatePharmacyDto } from "../../dtos/pharmacy.dto";

export const createPharmacyMutation = async (
  _parent: void,
  args: { input: CreatePharmacyDto }
): Promise<Pharmacy> => {
  return createPharmacy(args.input);
};

export const updatePharmacyMutation = async (
  _parent: void,
  args: { id: number; input: UpdatePharmacyDto }
): Promise<Pharmacy> => {
  return updatePharmacy(args.id, args.input);
};

export const deletePharmacyMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Pharmacy> => {
  return deletePharmacy(args.id);
};
