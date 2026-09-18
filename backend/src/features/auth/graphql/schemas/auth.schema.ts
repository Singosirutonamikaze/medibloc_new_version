/**
 * @file auth.schema.ts
 * @description Schema GraphQL SDL dedie a l'authentification et aux profils utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const authTypeDefs = `#graphql
  type SafeUser {
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

  type AuthPayload {
    user: SafeUser!
    token: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: Role
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Query {
    me: SafeUser
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;
