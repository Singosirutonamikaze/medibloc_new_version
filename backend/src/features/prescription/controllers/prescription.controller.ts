/**
 * @file prescription.controller.ts
 * @description Controleur HTTP Express pour le routage des actions d'ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllPrescriptions,
  findPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  findPatientPrescriptionsList,
  findDoctorPrescriptionsList,
} from "../services/prescription.service";
import { CreatePrescriptionDto, UpdatePrescriptionDto } from "../dtos/prescription.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Liste l'ensemble des ordonnances.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const list = await findAllPrescriptions();
    return successResponse(res, list, "Ordonnances recuperees avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere une ordonnance par son identifiant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const prescription = await findPrescriptionById(id);
    return successResponse(res, prescription, "Ordonnance recuperee avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Emet une nouvelle ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: CreatePrescriptionDto = req.body;
    const created = await createPrescription(dto);
    return successResponse(res, created, "Ordonnance emise avec succes", 201);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdatePrescriptionDto = req.body;
    const updated = await updatePrescription(id, dto);
    return successResponse(res, updated, "Ordonnance mise a jour avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime une ordonnance.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deletePrescription(id);
    return successResponse(res, deleted, "Ordonnance supprimee avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les ordonnances d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getByPatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patientId = parseIdParam(req.params.patientId);
    const list = await findPatientPrescriptionsList(patientId);
    return successResponse(res, list, "Ordonnances du patient recuperees", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les ordonnances d'un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctorId = parseIdParam(req.params.doctorId);
    const list = await findDoctorPrescriptionsList(doctorId);
    return successResponse(res, list, "Ordonnances du medecin recuperees", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
