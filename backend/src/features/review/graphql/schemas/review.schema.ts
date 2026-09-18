/**
 * @file review.schema.ts
 * @description Schema GraphQL SDL pour les avis et evaluations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const reviewTypeDefs = `#graphql
  type Review {
    id: Int!
    appointmentId: Int!
    patientId: Int!
    doctorId: Int!
    rating: Int!
    comment: String
    createdAt: String!
    doctor: Doctor
    patient: Patient
  }

  input CreateReviewInput {
    appointmentId: Int!
    patientId: Int!
    doctorId: Int!
    rating: Int!
    comment: String
  }

  extend type Query {
    reviews: [Review!]!
    doctorReviews(doctorId: Int!): [Review!]!
    review(id: Int!): Review
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    deleteReview(id: Int!): Review!
  }
`;
