/**
 * @file review.service.ts
 * @description Logique metier et persistance Prisma pour les evaluations et avis medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Review } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateReviewDto } from "../dtos/review.dto";

const reviewInclude = {
  doctor: { include: { user: true } },
  patient: { include: { user: true } },
  appointment: true,
};

export const findAllReviews = async (): Promise<Review[]> => {
  return prisma.review.findMany({
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const findDoctorReviews = async (
  doctorId: number
): Promise<Review[]> => {
  return prisma.review.findMany({
    where: { doctorId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const findReviewById = async (id: number): Promise<Review> => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: reviewInclude,
  });

  const exists = review !== null;
  const reviewResolvers: Record<string, () => Review> = {
    true: () => review as Review,
    false: () => {
      throw new Error("Avis introuvable");
    },
  };

  return reviewResolvers[String(exists)]();
};

export const createReview = async (
  dto: CreateReviewDto
): Promise<Review> => {
  return prisma.review.create({
    data: {
      appointmentId: dto.appointmentId,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      rating: dto.rating,
      comment: dto.comment || "",
    },
    include: reviewInclude,
  });
};

export const deleteReview = async (id: number): Promise<Review> => {
  return prisma.review.delete({
    where: { id },
  });
};
