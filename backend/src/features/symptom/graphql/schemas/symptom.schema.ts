/**
 * @file symptom.schema.ts
 * @description Schema GraphQL SDL pour les symptomes cliniques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const symptomTypeDefs = `#graphql
  type Symptom {
    id: Int!
    name: String!
    description: String
    createdAt: String!
  }

  input CreateSymptomInput {
    name: String!
    description: String
  }

  input UpdateSymptomInput {
    name: String
    description: String
  }

  extend type Query {
    symptoms: [Symptom!]!
    symptom(id: Int!): Symptom
  }

  extend type Mutation {
    createSymptom(input: CreateSymptomInput!): Symptom!
    updateSymptom(id: Int!, input: UpdateSymptomInput!): Symptom!
    deleteSymptom(id: Int!): Symptom!
  }
`;
