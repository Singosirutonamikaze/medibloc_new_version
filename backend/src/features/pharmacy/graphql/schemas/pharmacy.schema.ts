/**
 * @file pharmacy.schema.ts
 * @description Schema GraphQL SDL pour les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const pharmacyTypeDefs = `#graphql
  type Pharmacy {
    id: Int!
    name: String!
    address: String!
    city: String!
    countryId: Int!
    phone: String
    email: String
    createdAt: String!
    updatedAt: String!
  }

  input CreatePharmacyInput {
    name: String!
    address: String!
    city: String!
    countryId: Int!
    phone: String
    email: String
  }

  input UpdatePharmacyInput {
    name: String
    address: String
    city: String
    countryId: Int
    phone: String
    email: String
  }

  extend type Query {
    pharmacies: [Pharmacy!]!
    pharmacy(id: Int!): Pharmacy
  }

  extend type Mutation {
    createPharmacy(input: CreatePharmacyInput!): Pharmacy!
    updatePharmacy(id: Int!, input: UpdatePharmacyInput!): Pharmacy!
    deletePharmacy(id: Int!): Pharmacy!
  }
`;
