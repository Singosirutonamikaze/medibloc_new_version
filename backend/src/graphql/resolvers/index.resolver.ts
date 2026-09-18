/**
 * @file index.resolver.ts
 * @description Agregation centralisee des resolveurs GraphQL de toutes les fonctionnalites metiers.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { authResolvers } from "../../features/auth/graphql/resolvers/auth.resolver";
import { userResolvers } from "../../features/user/graphql/resolvers/user.resolver";
import { patientResolvers } from "../../features/patient/graphql/resolvers/patient.resolver";
import { doctorResolvers } from "../../features/doctor/graphql/resolvers/doctor.resolver";
import { appointmentResolvers } from "../../features/appointment/graphql/resolvers/appointment.resolver";
import { medicalRecordResolvers } from "../../features/medical-record/graphql/resolvers/medical-record.resolver";
import { prescriptionResolvers } from "../../features/prescription/graphql/resolvers/prescription.resolver";
import { diseaseResolvers } from "../../features/disease/graphql/resolvers/disease.resolver";
import { symptomResolvers } from "../../features/symptom/graphql/resolvers/symptom.resolver";
import { medicineResolvers } from "../../features/medicine/graphql/resolvers/medicine.resolver";
import { pharmacyResolvers } from "../../features/pharmacy/graphql/resolvers/pharmacy.resolver";
import { discussionResolvers } from "../../features/discussion/graphql/resolvers/discussion.resolver";
import { invoiceResolvers } from "../../features/invoice/graphql/resolvers/invoice.resolver";
import { notificationResolvers } from "../../features/notification/graphql/resolvers/notification.resolver";
import { reviewResolvers } from "../../features/review/graphql/resolvers/review.resolver";

/**
 * @description Objet agrege des resolveurs Query et Mutation pour le serveur GraphQL Apollo.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...patientResolvers.Query,
    ...doctorResolvers.Query,
    ...appointmentResolvers.Query,
    ...medicalRecordResolvers.Query,
    ...prescriptionResolvers.Query,
    ...diseaseResolvers.Query,
    ...symptomResolvers.Query,
    ...medicineResolvers.Query,
    ...pharmacyResolvers.Query,
    ...discussionResolvers.Query,
    ...invoiceResolvers.Query,
    ...notificationResolvers.Query,
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...patientResolvers.Mutation,
    ...doctorResolvers.Mutation,
    ...appointmentResolvers.Mutation,
    ...medicalRecordResolvers.Mutation,
    ...prescriptionResolvers.Mutation,
    ...diseaseResolvers.Mutation,
    ...symptomResolvers.Mutation,
    ...medicineResolvers.Mutation,
    ...pharmacyResolvers.Mutation,
    ...discussionResolvers.Mutation,
    ...invoiceResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
};

export default resolvers;
