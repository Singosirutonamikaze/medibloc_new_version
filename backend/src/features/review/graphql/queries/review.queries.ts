/**
 * @file review.queries.ts
 * @description Requetes GraphQL pour les avis et notations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Review } from "@prisma/client";
import {
  findAllReviews,
  findDoctorReviews,
  findReviewById,
} from "../../services/review.service";

export const reviewsQuery = async (
  _parent: void
): Promise<Review[]> => {
  return findAllReviews();
};

export const doctorReviewsQuery = async (
  _parent: void,
  args: { doctorId: number }
): Promise<Review[]> => {
  return findDoctorReviews(args.doctorId);
};

export const reviewQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Review> => {
  return findReviewById(args.id);
};
