/**
 * @file patient.schema.ts
 * @description Schema GraphQL SDL pour le domaine patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const patientTypeDefs = `#graphql
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type Patient {
    id: Int!
    userId: Int!
    birthDate: String
    gender: Gender
    phone: String
    address: String
    user: SafeUser
  }

  input CreatePatientInput {
    userId: Int!
    birthDate: String
    gender: Gender
    phone: String
    address: String
  }

  input UpdatePatientInput {
    birthDate: String
    gender: Gender
    phone: String
    address: String
  }

  extend type Query {
    patients: [Patient!]!
    patient(id: Int!): Patient
  }

  extend type Mutation {
    createPatient(input: CreatePatientInput!): Patient!
    updatePatient(id: Int!, input: UpdatePatientInput!): Patient!
    deletePatient(id: Int!): Patient!
  }
`;
