/**
 * @file medical-record.resolver.ts
 * @description Agregateur des requetes et mutations GraphQL pour le domaine des dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  medicalRecordsQuery,
  medicalRecordQuery,
  patientMedicalRecordsQuery,
} from "../queries/medical-record.queries";
import {
  createMedicalRecordMutation,
  updateMedicalRecordMutation,
  deleteMedicalRecordMutation,
} from "../mutations/medical-record.mutations";

export const medicalRecordResolvers = {
  Query: {
    medicalRecords: medicalRecordsQuery,
    medicalRecord: medicalRecordQuery,
    patientMedicalRecords: patientMedicalRecordsQuery,
  },
  Mutation: {
    createMedicalRecord: createMedicalRecordMutation,
    updateMedicalRecord: updateMedicalRecordMutation,
    deleteMedicalRecord: deleteMedicalRecordMutation,
  },
};

export default medicalRecordResolvers;
