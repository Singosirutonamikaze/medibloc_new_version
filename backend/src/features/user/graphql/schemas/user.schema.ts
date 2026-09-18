/**
 * @file user.schema.ts
 * @description Schema GraphQL SDL pour les utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const userTypeDefs = `#graphql
  type UserDetail {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    role: Role!
    avatarUrl: String
    isEmailVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    avatarUrl: String
  }

  extend type Query {
    users: [UserDetail!]!
    user(id: Int!): UserDetail
    userProfile: UserDetail
  }

  extend type Mutation {
    updateUser(id: Int!, input: UpdateUserInput!): UserDetail!
    deleteUser(id: Int!): UserDetail!
  }
`;
