/**
 * @file appointment.controller.ts
 * @description Controleur HTTP Express pour le routage des operations sur les rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import {
  findAllAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  findPatientAppointments,
  findDoctorAppointments,
} from "../services/appointment.service";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../dtos/appointment.dto";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";

/**
 * @description Liste l'ensemble des rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param _req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const getAll = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const list = await findAllAppointments();
    return successResponse(res, list, "Rendez-vous recuperes avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 500);
  }
};

/**
 * @description Recupere un rendez-vous par son identifiant unique.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const getById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const appointment = await findAppointmentById(id);
    return successResponse(res, appointment, "Rendez-vous recupere avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

/**
 * @description Cree un nouveau rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express transportant {@link CreateAppointmentDto}.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: CreateAppointmentDto = req.body;
    const created = await createAppointment(dto);
    return successResponse(res, created, "Rendez-vous planifie avec succes", 201);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour un rendez-vous existant.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express transportant {@link UpdateAppointmentDto}.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: UpdateAppointmentDto = req.body;
    const updated = await updateAppointment(id, dto);
    return successResponse(res, updated, "Rendez-vous mis a jour avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Supprime un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const remove = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const deleted = await deleteAppointment(id);
    return successResponse(res, deleted, "Rendez-vous supprime avec succes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Met a jour le statut d'un rendez-vous.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const changeStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const { status } = req.body as { status: AppointmentStatus };
    const updated = await updateAppointmentStatus(id, status);
    return successResponse(res, updated, "Statut de rendez-vous actualise", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les rendez-vous d'un patient.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const getByPatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patientId = parseIdParam(req.params.patientId);
    const list = await findPatientAppointments(patientId);
    return successResponse(res, list, "Rendez-vous du patient recuperes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

/**
 * @description Liste les rendez-vous d'un praticien.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 *
 * @param req Requete HTTP Express.
 * @param res Reponse HTTP Express.
 * @returns Promesse de reponse HTTP.
 */
export const getByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctorId = parseIdParam(req.params.doctorId);
    const list = await findDoctorAppointments(doctorId);
    return successResponse(res, list, "Rendez-vous du medecin recuperes", 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
