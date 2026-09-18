/**
 * @file medical-record.controller.ts
 * @description Controleur HTTP Express pour le routage des operations de dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllMedicalRecords,
  findMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  findPatientMedicalRecordsList,
} from "../services/medical-record.service";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "../dtos/medical-record.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Liste l'ensemble des dossiers medicaux.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const list = await findAllMedicalRecords();
    return successResponse(res, list, "Dossiers medicaux recuperes avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere une entree de dossier medical par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const record = await findMedicalRecordById(id);
    return successResponse(res, record, "Dossier medical recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Cree un nouveau dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: CreateMedicalRecordDto = req.body;
    const created = await createMedicalRecord(dto);
    return successResponse(res, created, "Dossier medical enregistre avec succes", 201);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateMedicalRecordDto = req.body;
    const updated = await updateMedicalRecord(id, dto);
    return successResponse(res, updated, "Dossier medical actualise avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un dossier medical.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteMedicalRecord(id);
    return successResponse(res, deleted, "Dossier medical supprime avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les observations cliniques d'un patient specifique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getByPatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patientId = parseIdParam(req.params.patientId);
    const records = await findPatientMedicalRecordsList(patientId);
    return successResponse(res, records, "Dossiers medicaux du patient recuperes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
