/**
 * @file disease.schema.ts
 * @description Schema GraphQL SDL pour le domaine des pathologies et affections.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const diseaseTypeDefs = `#graphql
  type DiseaseSymptomRel {
    id: Int!
    diseaseId: Int!
    symptomId: Int!
    isCommon: Boolean!
  }

  type Disease {
    id: Int!
    name: String!
    description: String
    isViral: Boolean!
    isBacterial: Boolean!
    isGenetic: Boolean!
    isChronic: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateDiseaseInput {
    name: String!
    description: String
    isViral: Boolean
    isBacterial: Boolean
    isGenetic: Boolean
    isChronic: Boolean
  }

  input UpdateDiseaseInput {
    name: String
    description: String
    isViral: Boolean
    isBacterial: Boolean
    isGenetic: Boolean
    isChronic: Boolean
  }

  extend type Query {
    diseases: [Disease!]!
    disease(id: Int!): Disease
  }

  extend type Mutation {
    createDisease(input: CreateDiseaseInput!): Disease!
    updateDisease(id: Int!, input: UpdateDiseaseInput!): Disease!
    deleteDisease(id: Int!): Disease!
  }
`;
