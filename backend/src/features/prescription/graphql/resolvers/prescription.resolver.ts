/**
 * @file prescription.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine des ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  prescriptionsQuery,
  prescriptionQuery,
  patientPrescriptionsQuery,
  doctorPrescriptionsQuery,
} from "../queries/prescription.queries";
import {
  createPrescriptionMutation,
  updatePrescriptionMutation,
  deletePrescriptionMutation,
} from "../mutations/prescription.mutations";

export const prescriptionResolvers = {
  Query: {
    prescriptions: prescriptionsQuery,
    prescription: prescriptionQuery,
    patientPrescriptions: patientPrescriptionsQuery,
    doctorPrescriptions: doctorPrescriptionsQuery,
  },
  Mutation: {
    createPrescription: createPrescriptionMutation,
    updatePrescription: updatePrescriptionMutation,
    deletePrescription: deletePrescriptionMutation,
  },
};

export default prescriptionResolvers;
