/**
 * @file review.controller.ts
 * @description Controleur HTTP Express pour le routage des avis et evaluations.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllReviews,
  findDoctorReviews,
  findReviewById,
  createReview,
  deleteReview,
} from "../services/review.service";
import { CreateReviewDto } from "../dtos/review.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";
import { AuthRequest } from "../../../core/types/global/global.types";

export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const reviews = await findAllReviews();
    return successResponse(
      res,
      reviews,
      "Avis recuperes avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getDoctorReviews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const doctorId = parseIdParam(req.params.doctorId);
    const reviews = await findDoctorReviews(doctorId);
    return successResponse(
      res,
      reviews,
      "Avis du medecin recuperes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const review = await findReviewById(id);
    return successResponse(
      res,
      review,
      "Avis recupere avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const create = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateReviewDto = req.body;
    const created = await createReview(dto);
    return successResponse(
      res,
      created,
      "Avis enregistre avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteReview(id);
    return successResponse(
      res,
      deleted,
      "Avis supprime avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
