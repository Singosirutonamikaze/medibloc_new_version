/**
 * @file medicine.schema.ts
 * @description Schema GraphQL SDL pour les medicaments et produits pharmaceutiques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const medicineTypeDefs = `#graphql
  enum MedicineType {
    MODERN
    TRADITIONAL
    ALTERNATIVE
  }

  type Medicine {
    id: Int!
    name: String!
    type: MedicineType!
    description: String
    composition: String
    scientificName: String
    commonNames: [String!]!
    pharmacyId: Int
    sideEffects: [String!]!
    contraindications: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateMedicineInput {
    name: String!
    type: MedicineType!
    description: String
    composition: String
    scientificName: String
    commonNames: [String!]
    pharmacyId: Int
    sideEffects: [String!]
    contraindications: [String!]
  }

  input UpdateMedicineInput {
    name: String
    type: MedicineType
    description: String
    composition: String
    scientificName: String
    commonNames: [String!]
    pharmacyId: Int
    sideEffects: [String!]
    contraindications: [String!]
  }

  extend type Query {
    medicines: [Medicine!]!
    medicine(id: Int!): Medicine
  }

  extend type Mutation {
    createMedicine(input: CreateMedicineInput!): Medicine!
    updateMedicine(id: Int!, input: UpdateMedicineInput!): Medicine!
    deleteMedicine(id: Int!): Medicine!
  }
`;
