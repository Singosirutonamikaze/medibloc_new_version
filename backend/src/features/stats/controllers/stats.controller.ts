/**
 * @file stats.controller.ts
 * @description Controleur HTTP Express pour le tableau de bord et les statistiques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findOverviewStats,
  findDiseaseStats,
  findAppointmentStats,
  findPatientStats,
} from "../services/stats.service";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";

export const getOverview = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stats = await findOverviewStats();
    return successResponse(
      res,
      stats,
      "Statistiques globales recuperees avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getDiseaseStats = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stats = await findDiseaseStats();
    return successResponse(
      res,
      stats,
      "Statistiques des pathologies recuperees",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getAppointmentStats = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stats = await findAppointmentStats();
    return successResponse(
      res,
      stats,
      "Statistiques des rendez-vous recuperees",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getPatientStats = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stats = await findPatientStats();
    return successResponse(
      res,
      stats,
      "Statistiques des patients recuperees",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};
