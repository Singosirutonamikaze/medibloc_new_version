/**
 * @file medicine.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { medicinesQuery, medicineQuery } from "../queries/medicine.queries";
import {
  createMedicineMutation,
  updateMedicineMutation,
  deleteMedicineMutation,
} from "../mutations/medicine.mutations";

export const medicineResolvers = {
  Query: {
    medicines: medicinesQuery,
    medicine: medicineQuery,
  },
  Mutation: {
    createMedicine: createMedicineMutation,
    updateMedicine: updateMedicineMutation,
    deleteMedicine: deleteMedicineMutation,
  },
};

export default medicineResolvers;
