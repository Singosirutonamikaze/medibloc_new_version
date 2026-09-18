/**
 * @file discussion.controller.ts
 * @description Controleur HTTP Express pour la messagerie et les fils de discussion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findAllDiscussions,
  findDiscussionById,
  getOrCreateDiscussion,
  findDiscussionMessages,
  createMessageInDiscussion,
  markMessagesAsReadInDiscussion,
} from "../services/discussion.service";
import { CreateMessageDto } from "../dtos/discussion.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";
import { parseNumber } from "../../../core/utils/helpers/helpers.util";
import { Role } from "@prisma/client";

export const getAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientQuery = req.query.patientId as string | undefined;
    const doctorQuery = req.query.doctorId as string | undefined;
    const patientId = patientQuery ? parseNumber(patientQuery, 0) : undefined;
    const doctorId = doctorQuery ? parseNumber(doctorQuery, 0) : undefined;

    const discussions = await findAllDiscussions({ patientId, doctorId });
    return successResponse(
      res,
      discussions,
      "Discussions recuperees avec succes",
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
    const discussion = await findDiscussionById(id);
    return successResponse(
      res,
      discussion,
      "Discussion recuperee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const getOrCreate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const patientId = parseNumber(req.body.patientId, 0);
    const doctorId = parseNumber(req.body.doctorId, 0);
    const discussion = await getOrCreateDiscussion(patientId, doctorId);
    return successResponse(
      res,
      discussion,
      "Discussion initialisee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const messages = await findDiscussionMessages(id);
    return successResponse(
      res,
      messages,
      "Messages recuperes avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 404);
  }
};

export const createMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const dto: CreateMessageDto = req.body;
    const message = await createMessageInDiscussion(id, dto);
    return successResponse(
      res,
      message,
      "Message envoye avec succes",
      201
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseIdParam(req.params.id);
    const role = req.body.role as Role;
    const count = await markMessagesAsReadInDiscussion(id, role);
    return successResponse(
      res,
      { count },
      "Messages marques comme lus",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
