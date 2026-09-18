/**
 * @file review.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les avis.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  reviewsQuery,
  doctorReviewsQuery,
  reviewQuery,
} from "../queries/review.queries";
import {
  createReviewMutation,
  deleteReviewMutation,
} from "../mutations/review.mutations";

export const reviewResolvers = {
  Query: {
    reviews: reviewsQuery,
    doctorReviews: doctorReviewsQuery,
    review: reviewQuery,
  },
  Mutation: {
    createReview: createReviewMutation,
    deleteReview: deleteReviewMutation,
  },
};

export default reviewResolvers;
