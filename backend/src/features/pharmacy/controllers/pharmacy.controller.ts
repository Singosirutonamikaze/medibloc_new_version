/**
 * @file pharmacy.controller.ts
 * @description Controleur HTTP Express pour le routage des actions sur les pharmacies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllPharmacies,
  findPharmacyById,
  findPharmaciesByCountry,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  findPharmacyMedicines,
} from "../services/pharmacy.service";
import { CreatePharmacyDto, UpdatePharmacyDto } from "../dtos/pharmacy.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pharmacies = await findAllPharmacies();
    return successResponse(
      res,
      pharmacies,
      "Pharmacies recuperees avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const pharmacy = await findPharmacyById(id);
    return successResponse(
      res,
      pharmacy,
      "Pharmacie recuperee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const getByCountry = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const countryId = parseIdParam(req.params.countryId);
    const pharmacies = await findPharmaciesByCountry(countryId);
    return successResponse(
      res,
      pharmacies,
      "Pharmacies du pays recuperees avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreatePharmacyDto = req.body;
    const created = await createPharmacy(dto);
    return successResponse(
      res,
      created,
      "Pharmacie enregistree avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdatePharmacyDto = req.body;
    const updated = await updatePharmacy(id, dto);
    return successResponse(
      res,
      updated,
      "Pharmacie mise a jour avec succes",
      200
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
    const deleted = await deletePharmacy(id);
    return successResponse(
      res,
      deleted,
      "Pharmacie supprimee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const getMedicines = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const medicines = await findPharmacyMedicines(id);
    return successResponse(
      res,
      medicines,
      "Medicaments de la pharmacie recuperes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export default {
  getAll,
  getById,
  getByCountry,
  create,
  update,
  remove,
  getMedicines,
};
