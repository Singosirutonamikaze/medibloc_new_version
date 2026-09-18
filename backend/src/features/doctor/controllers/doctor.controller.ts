/**
 * @file doctor.controller.ts
 * @description Controleur HTTP Express pour le routage des operations sur les praticiens.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllDoctors,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  findDoctorSpecialties,
  findDoctorAppointmentsList,
  findDoctorPrescriptionsList,
} from "../services/doctor.service";
import { CreateDoctorDto, UpdateDoctorDto } from "../dtos/doctor.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Liste l'ensemble des medecins.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const list = await findAllDoctors();
    return successResponse(res, list, "Medecins recuperes avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un medecin par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const doctor = await findDoctorById(id);
    return successResponse(res, doctor, "Medecin recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Cree un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: CreateDoctorDto = req.body;
    const created = await createDoctor(dto);
    return successResponse(res, created, "Profil medecin cree avec succes", 201);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateDoctorDto = req.body;
    const updated = await updateDoctor(id, dto);
    return successResponse(res, updated, "Profil medecin mis a jour avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un profil medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteDoctor(id);
    return successResponse(res, deleted, "Medecin supprime avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les specialites medicales.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getSpecialties = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const specialties = await findDoctorSpecialties();
    return successResponse(res, specialties, "Specialites recuperees avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Liste les rendez-vous d'un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const list = await findDoctorAppointmentsList(id);
    return successResponse(res, list, "Rendez-vous du medecin recuperes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les ordonnances emises par un medecin.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export const getPrescriptions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const list = await findDoctorPrescriptionsList(id);
    return successResponse(res, list, "Ordonnances du medecin recuperees", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
