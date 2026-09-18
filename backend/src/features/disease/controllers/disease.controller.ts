/**
 * @file disease.controller.ts
 * @description Controleur HTTP Express pour le routage des actions sur les pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllDiseases,
  findDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
  findDiseaseSymptoms,
  findDiseaseCountries,
  addSymptomToDisease,
  removeSymptomFromDisease,
} from "../services/disease.service";
import { CreateDiseaseDto, UpdateDiseaseDto } from "../dtos/disease.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Recupere toutes les pathologies.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const diseases = await findAllDiseases();
    return successResponse(
      res,
      diseases,
      "Pathologies recuperees avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere une pathologie par son identifiant unique.
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
    const disease = await findDiseaseById(id);
    return successResponse(
      res,
      disease,
      "Pathologie recuperee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Enregistre une nouvelle pathologie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateDiseaseDto = req.body;
    const created = await createDisease(dto);
    return successResponse(
      res,
      created,
      "Pathologie enregistree avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour une pathologie existante.
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
    const dto: UpdateDiseaseDto = req.body;
    const updated = await updateDisease(id, dto);
    return successResponse(
      res,
      updated,
      "Pathologie mise a jour avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime une pathologie.
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
    const deleted = await deleteDisease(id);
    return successResponse(
      res,
      deleted,
      "Pathologie supprimee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les symptomes d'une pathologie donnee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getSymptoms = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const symptoms = await findDiseaseSymptoms(id);
    return successResponse(
      res,
      symptoms,
      "Symptomes de la pathologie recuperes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Liste les pays touches par la pathologie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getCountries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const countries = await findDiseaseCountries(id);
    return successResponse(
      res,
      countries,
      "Pays touches recuperes avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Associe un symptome a une maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const addSymptom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const symptomId = parseIdParam(req.params.symptomId);
    const attached = await addSymptomToDisease(id, symptomId);
    return successResponse(
      res,
      attached,
      "Symptome associe avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Dissocie un symptome d'une maladie.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const removeSymptom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const symptomId = parseIdParam(req.params.symptomId);
    const detached = await removeSymptomFromDisease(id, symptomId);
    return successResponse(
      res,
      detached,
      "Symptome dissocie avec succes",
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
  create,
  update,
  remove,
  getSymptoms,
  getCountries,
  addSymptom,
  removeSymptom,
};
