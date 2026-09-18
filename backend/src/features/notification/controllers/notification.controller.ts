/**
 * @file notification.controller.ts
 * @description Controleur HTTP Express pour le routage des notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import {
  findUserNotifications,
  findNotificationById,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notification.service";
import { CreateNotificationDto } from "../dtos/notification.dto";
import {
  successResponse,
  errorResponse,
} from "../../../core/utils/responses/response.util";
import { parseIdParam } from "../../../core/utils/parsers/parseIdParam.util";
import { AuthRequest } from "../../../core/types/global/global.types";

export const getUserNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user ? req.user.id : 0;
    const notifications = await findUserNotifications(userId);
    return successResponse(
      res,
      notifications,
      "Notifications recuperees avec succes",
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
    const notification = await findNotificationById(id);
    return successResponse(
      res,
      notification,
      "Notification recuperee avec succes",
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
    const dto: CreateNotificationDto = req.body;
    const created = await createNotification(dto);
    return successResponse(
      res,
      created,
      "Notification creee avec succes",
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
    const updated = await markNotificationAsRead(id);
    return successResponse(
      res,
      updated,
      "Notification marquee comme lue",
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
    const deleted = await deleteNotification(id);
    return successResponse(
      res,
      deleted,
      "Notification supprimee avec succes",
      200
    );
  } catch (err) {
    const error = err as Error;
    return errorResponse(res, error.message, 400);
  }
};
