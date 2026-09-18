/**
 * @file patient.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { patientsQuery, patientQuery } from "../queries/patient.queries";
import {
  createPatientMutation,
  updatePatientMutation,
  deletePatientMutation,
} from "../mutations/patient.mutations";

export const patientResolvers = {
  Query: {
    patients: patientsQuery,
    patient: patientQuery,
  },
  Mutation: {
    createPatient: createPatientMutation,
    updatePatient: updatePatientMutation,
    deletePatient: deletePatientMutation,
  },
};

export default patientResolvers;
