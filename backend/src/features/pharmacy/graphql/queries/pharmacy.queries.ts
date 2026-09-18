/**
 * @file pharmacy.queries.ts
 * @description Requetes GraphQL pour les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Pharmacy } from "@prisma/client";
import {
  findAllPharmacies,
  findPharmacyById,
} from "../../services/pharmacy.service";

export const pharmaciesQuery = async (
  _parent: void
): Promise<Pharmacy[]> => {
  return findAllPharmacies();
};

export const pharmacyQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Pharmacy> => {
  return findPharmacyById(args.id);
};
