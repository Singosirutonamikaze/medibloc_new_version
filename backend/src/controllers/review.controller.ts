import { Request, Response } from "express";
import { Review, Prisma } from "@prisma/client";
import prisma from "../config/database";
import GenericController from "../gen/generic.controller";
import { ApiResponse } from "../types";

type ReviewCreateInput = Prisma.ReviewCreateInput;
type ReviewUpdateInput = Prisma.ReviewUpdateInput;

export class ReviewController {
  private readonly generic: GenericController<
    Review,
    ReviewCreateInput,
    ReviewUpdateInput
  >;

  public getAllReviews: (req: Request, res: Response) => Promise<Response>;
  public getReviewById: (req: Request, res: Response) => Promise<Response>;
  public createReview: (req: Request, res: Response) => Promise<Response>;
  public updateReview: (req: Request, res: Response) => Promise<Response>;
  public deleteReview: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.ReviewFindManyArgs) =>
        prisma.review.findMany({
          ...params,
          include: {
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            patient: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        }),
      findUnique: (params: Prisma.ReviewFindUniqueArgs) =>
        prisma.review.findUnique({
          ...params,
          include: {
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            patient: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            appointment: true,
          },
        }),
      create: (params: { data: ReviewCreateInput }) =>
        prisma.review.create({ data: params.data }),
      update: (params: { where: { id: number }; data: ReviewUpdateInput }) =>
        prisma.review.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.review.delete({ where: params.where }),
      count: (params?: Prisma.ReviewCountArgs) => prisma.review.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllReviews = this.generic.getAll;
    this.getReviewById = this.generic.getOne;
    this.createReview = this.generic.create;
    this.updateReview = this.generic.update;
    this.deleteReview = this.generic.delete;
  }

  // Get reviews for a specific doctor
  public getDoctorReviews = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Review[]> = { success: true, data: [] };
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId || doctorId <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant médecin invalide" };
      } else {
        const reviews = await prisma.review.findMany({
          where: { doctorId },
          include: {
            patient: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, avatarUrl: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        response = { success: true, data: reviews };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Get reviews submitted by a specific patient
  public getPatientReviews = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Review[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: "Identifiant patient invalide" };
      } else {
        const reviews = await prisma.review.findMany({
          where: { patientId },
          include: {
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        response = { success: true, data: reviews };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };
}
