/**
 * @file patient.controller.ts
 * @description Controleur HTTP Express pour le routage des actions sur les profils patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllPatients,
  findPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  findPatientDiseases,
  findPatientAppointmentsList,
  findPatientPrescriptionsList,
} from "../services/patient.service";
import { CreatePatientDto, UpdatePatientDto } from "../dtos/patient.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Liste l'ensemble des patients enregistres.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const patients = await findAllPatients();
    return successResponse(res, patients, "Patients recuperes avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un patient par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const patient = await findPatientById(id);
    return successResponse(res, patient, "Patient recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Cree un nouveau profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: CreatePatientDto = req.body;
    const created = await createPatient(dto);
    return successResponse(res, created, "Profil patient cree avec succes", 201);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un profil patient existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdatePatientDto = req.body;
    const updated = await updatePatient(id, dto);
    return successResponse(res, updated, "Profil patient mis a jour avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un profil patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deletePatient(id);
    return successResponse(res, deleted, "Patient supprime avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les pathologies d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getDiseases = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const diseases = await findPatientDiseases(id);
    return successResponse(res, diseases, "Pathologies du patient recuperees", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Liste les rendez-vous d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const appointments = await findPatientAppointmentsList(id);
    return successResponse(res, appointments, "Rendez-vous du patient recuperes", 200);
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
export const getPrescriptions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const prescriptions = await findPatientPrescriptionsList(id);
    return successResponse(res, prescriptions, "Ordonnances du patient recuperees", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
