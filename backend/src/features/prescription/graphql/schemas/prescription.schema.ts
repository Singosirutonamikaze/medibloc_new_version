/**
 * @file prescription.schema.ts
 * @description Schema GraphQL SDL pour les ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const prescriptionTypeDefs = `#graphql
  type Prescription {
    id: Int!
    doctorId: Int!
    patientId: Int!
    medications: String!
    diagnosis: String
    notes: String
    issuedAt: String!
    patient: Patient
    doctor: Doctor
  }

  input CreatePrescriptionInput {
    doctorId: Int!
    patientId: Int!
    medications: String!
    diagnosis: String
    notes: String
  }

  input UpdatePrescriptionInput {
    medications: String
    diagnosis: String
    notes: String
  }

  extend type Query {
    prescriptions: [Prescription!]!
    prescription(id: Int!): Prescription
    patientPrescriptions(patientId: Int!): [Prescription!]!
    doctorPrescriptions(doctorId: Int!): [Prescription!]!
  }

  extend type Mutation {
    createPrescription(input: CreatePrescriptionInput!): Prescription!
    updatePrescription(id: Int!, input: UpdatePrescriptionInput!): Prescription!
    deletePrescription(id: Int!): Prescription!
  }
`;
