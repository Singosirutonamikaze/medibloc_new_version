/**
 * @file medicine.controller.ts
 * @description Controleur HTTP Express pour le routage des actions sur les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllMedicines,
  findMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../services/medicine.service";
import { CreateMedicineDto, UpdateMedicineDto } from "../dtos/medicine.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Recupere tous les medicaments.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const medicines = await findAllMedicines();
    return successResponse(
      res,
      medicines,
      "Medicaments recuperes avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un medicament par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const medicine = await findMedicineById(id);
    return successResponse(
      res,
      medicine,
      "Medicament recupere avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Enregistre un nouveau medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateMedicineDto = req.body;
    const created = await createMedicine(dto);
    return successResponse(
      res,
      created,
      "Medicament enregistre avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateMedicineDto = req.body;
    const updated = await updateMedicine(id, dto);
    return successResponse(
      res,
      updated,
      "Medicament mis a jour avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un medicament.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteMedicine(id);
    return successResponse(
      res,
      deleted,
      "Medicament supprime avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
