import { Request, Response } from "express";
import { Notification, Prisma } from "@prisma/client";
import prisma from "../config/database";
import GenericController from "../gen/generic.controller";
import { ApiResponse } from "../types";

type NotificationCreateInput = Prisma.NotificationCreateInput;
type NotificationUpdateInput = Prisma.NotificationUpdateInput;

export class NotificationController {
  private readonly generic: GenericController<
    Notification,
    NotificationCreateInput,
    NotificationUpdateInput
  >;

  public getAllNotifications: (
    req: Request,
    res: Response,
  ) => Promise<Response>;
  public getNotificationById: (
    req: Request,
    res: Response,
  ) => Promise<Response>;
  public createNotification: (req: Request, res: Response) => Promise<Response>;
  public updateNotification: (req: Request, res: Response) => Promise<Response>;
  public deleteNotification: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.NotificationFindManyArgs) =>
        prisma.notification.findMany(params),
      findUnique: (params: Prisma.NotificationFindUniqueArgs) =>
        prisma.notification.findUnique(params),
      create: (params: { data: NotificationCreateInput }) =>
        prisma.notification.create({ data: params.data }),
      update: (params: {
        where: { id: number };
        data: NotificationUpdateInput;
      }) =>
        prisma.notification.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.notification.delete({ where: params.where }),
      count: (params?: Prisma.NotificationCountArgs) =>
        prisma.notification.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllNotifications = this.generic.getAll;
    this.getNotificationById = this.generic.getOne;
    this.createNotification = this.generic.create;
    this.updateNotification = this.generic.update;
    this.deleteNotification = this.generic.delete;
  }

  // Get notifications for a user
  public getUserNotifications = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Notification[]> = { success: true, data: [] };
    try {
      const userId = Number(req.params.userId);
      if (!userId || userId <= 0) {
        status = 400;
        response = {
          success: false,
          error: "Identifiant utilisateur invalide",
        };
      } else {
        const notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        response = { success: true, data: notifications };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Mark a notification as read
  public markAsRead = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Notification> = { success: true };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = {
          success: false,
          error: "Identifiant notification invalide",
        };
      } else {
        const updated = await prisma.notification.update({
          where: { id },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
        response = { success: true, data: updated };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Mark all user notifications as read
  public markAllAsRead = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<{ count: number }> = { success: true };
    try {
      const userId = Number(req.params.userId);
      if (!userId || userId <= 0) {
        status = 400;
        response = {
          success: false,
          error: "Identifiant utilisateur invalide",
        };
      } else {
        const updated = await prisma.notification.updateMany({
          where: {
            userId,
            isRead: false,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
        response = { success: true, data: { count: updated.count } };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };
}
