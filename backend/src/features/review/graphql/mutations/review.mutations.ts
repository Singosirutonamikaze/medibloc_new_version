/**
 * @file review.mutations.ts
 * @description Mutations GraphQL pour les avis et notations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Review } from "@prisma/client";
import { createReview, deleteReview } from "../../services/review.service";
import { CreateReviewDto } from "../../dtos/review.dto";

export const createReviewMutation = async (
  _parent: void,
  args: { input: CreateReviewDto }
): Promise<Review> => {
  return createReview(args.input);
};

export const deleteReviewMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Review> => {
  return deleteReview(args.id);
};
