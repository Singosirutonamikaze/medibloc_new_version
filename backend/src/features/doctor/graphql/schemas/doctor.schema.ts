/**
 * @file doctor.schema.ts
 * @description Schema GraphQL SDL pour les praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const doctorTypeDefs = `#graphql
  type Doctor {
    id: Int!
    userId: Int!
    specialty: String
    phone: String
    user: SafeUser
  }

  input CreateDoctorInput {
    userId: Int!
    specialty: String
    phone: String
  }

  input UpdateDoctorInput {
    specialty: String
    phone: String
  }

  extend type Query {
    doctors: [Doctor!]!
    doctor(id: Int!): Doctor
    specialties: [String!]!
  }

  extend type Mutation {
    createDoctor(input: CreateDoctorInput!): Doctor!
    updateDoctor(id: Int!, input: UpdateDoctorInput!): Doctor!
    deleteDoctor(id: Int!): Doctor!
  }
`;
