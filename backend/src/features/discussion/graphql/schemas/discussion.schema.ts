/**
 * @file discussion.schema.ts
 * @description Schema GraphQL SDL pour la messagerie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const discussionTypeDefs = `#graphql
  type Message {
    id: Int!
    discussionId: Int!
    senderRole: Role!
    content: String
    fileUrl: String
    isRead: Boolean!
    readAt: String
    sentAt: String!
  }

  type Discussion {
    id: Int!
    patientId: Int!
    doctorId: Int!
    createdAt: String!
    patient: Patient
    doctor: Doctor
    messages: [Message!]!
  }

  input SendMessageInput {
    discussionId: Int!
    senderRole: Role!
    content: String
    fileUrl: String
  }

  extend type Query {
    discussions: [Discussion!]!
    discussion(id: Int!): Discussion
    discussionMessages(discussionId: Int!): [Message!]!
  }

  extend type Mutation {
    sendMessage(input: SendMessageInput!): Message!
    markMessagesAsRead(discussionId: Int!, role: Role!): Int!
  }
`;
