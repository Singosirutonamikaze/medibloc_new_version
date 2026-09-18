/**
 * @file medical-record.schema.ts
 * @description Schema GraphQL SDL pour les dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const medicalRecordTypeDefs = `#graphql
  type MedicalRecord {
    id: Int!
    patientId: Int!
    title: String!
    content: String!
    files: [String!]!
    createdAt: String!
    patient: Patient
  }

  input CreateMedicalRecordInput {
    patientId: Int!
    title: String!
    content: String!
    files: [String!]
  }

  input UpdateMedicalRecordInput {
    title: String
    content: String
    files: [String!]
  }

  extend type Query {
    medicalRecords: [MedicalRecord!]!
    medicalRecord(id: Int!): MedicalRecord
    patientMedicalRecords(patientId: Int!): [MedicalRecord!]!
  }

  extend type Mutation {
    createMedicalRecord(input: CreateMedicalRecordInput!): MedicalRecord!
    updateMedicalRecord(id: Int!, input: UpdateMedicalRecordInput!): MedicalRecord!
    deleteMedicalRecord(id: Int!): MedicalRecord!
  }
`;
