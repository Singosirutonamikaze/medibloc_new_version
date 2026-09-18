/**
 * @file symptom.controller.ts
 * @description Controleur HTTP Express pour le routage des actions sur les symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllSymptoms,
  findSymptomById,
  createSymptom,
  updateSymptom,
  deleteSymptom,
  findSymptomDiseases,
} from "../services/symptom.service";
import { CreateSymptomDto, UpdateSymptomDto } from "../dtos/symptom.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Recupere l'ensemble des symptomes.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const symptoms = await findAllSymptoms();
    return successResponse(
      res,
      symptoms,
      "Symptomes recuperes avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un symptome par son identifiant unique.
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
    const symptom = await findSymptomById(id);
    return successResponse(
      res,
      symptom,
      "Symptome recupere avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Recupere les maladies associees a un symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getDiseases = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const diseases = await findSymptomDiseases(id);
    return successResponse(
      res,
      diseases,
      "Maladies associees au symptome",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Enregistre un nouveau symptome.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateSymptomDto = req.body;
    const created = await createSymptom(dto);
    return successResponse(
      res,
      created,
      "Symptome enregistre avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un symptome existant.
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
    const dto: UpdateSymptomDto = req.body;
    const updated = await updateSymptom(id, dto);
    return successResponse(
      res,
      updated,
      "Symptome mis a jour avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un symptome.
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
    const deleted = await deleteSymptom(id);
    return successResponse(
      res,
      deleted,
      "Symptome supprime avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export default {
  getAll,
  getById,
  getDiseases,
  create,
  update,
  remove,
};
