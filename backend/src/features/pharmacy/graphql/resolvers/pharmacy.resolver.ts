/**
 * @file pharmacy.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { pharmaciesQuery, pharmacyQuery } from "../queries/pharmacy.queries";
import {
  createPharmacyMutation,
  updatePharmacyMutation,
  deletePharmacyMutation,
} from "../mutations/pharmacy.mutations";

export const pharmacyResolvers = {
  Query: {
    pharmacies: pharmaciesQuery,
    pharmacy: pharmacyQuery,
  },
  Mutation: {
    createPharmacy: createPharmacyMutation,
    updatePharmacy: updatePharmacyMutation,
    deletePharmacy: deletePharmacyMutation,
  },
};

export default pharmacyResolvers;
