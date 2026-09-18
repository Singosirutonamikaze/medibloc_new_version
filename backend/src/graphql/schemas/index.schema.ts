/**
 * @file index.schema.ts
 * @description Agregation centralisee des definitions de schemas GraphQL (TypeDefs) de toutes les features.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { authTypeDefs } from "../../features/auth/graphql/schemas/auth.schema";
import { userTypeDefs } from "../../features/user/graphql/schemas/user.schema";
import { patientTypeDefs } from "../../features/patient/graphql/schemas/patient.schema";
import { doctorTypeDefs } from "../../features/doctor/graphql/schemas/doctor.schema";
import { appointmentTypeDefs } from "../../features/appointment/graphql/schemas/appointment.schema";
import { medicalRecordTypeDefs } from "../../features/medical-record/graphql/schemas/medical-record.schema";
import { prescriptionTypeDefs } from "../../features/prescription/graphql/schemas/prescription.schema";
import { diseaseTypeDefs } from "../../features/disease/graphql/schemas/disease.schema";
import { symptomTypeDefs } from "../../features/symptom/graphql/schemas/symptom.schema";
import { medicineTypeDefs } from "../../features/medicine/graphql/schemas/medicine.schema";
import { pharmacyTypeDefs } from "../../features/pharmacy/graphql/schemas/pharmacy.schema";
import { discussionTypeDefs } from "../../features/discussion/graphql/schemas/discussion.schema";
import { invoiceTypeDefs } from "../../features/invoice/graphql/schemas/invoice.schema";
import { notificationTypeDefs } from "../../features/notification/graphql/schemas/notification.schema";
import { reviewTypeDefs } from "../../features/review/graphql/schemas/review.schema";

const rootTypeDefs = `#graphql
  enum Role {
    PATIENT
    DOCTOR
    ADMIN
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/**
 * @description Tableau unifie des definitions de schemas GraphQL pour l'ensemble des modules.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const typeDefs = [
  rootTypeDefs,
  authTypeDefs,
  userTypeDefs,
  patientTypeDefs,
  doctorTypeDefs,
  appointmentTypeDefs,
  medicalRecordTypeDefs,
  prescriptionTypeDefs,
  diseaseTypeDefs,
  symptomTypeDefs,
  medicineTypeDefs,
  pharmacyTypeDefs,
  discussionTypeDefs,
  invoiceTypeDefs,
  notificationTypeDefs,
  reviewTypeDefs,
];

export default typeDefs;
