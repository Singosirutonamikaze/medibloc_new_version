/**
 * @file notification.service.ts
 * @description Logique metier et persistance Prisma pour les notifications utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Notification } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateNotificationDto } from "../dtos/notification.dto";

export const findAllNotifications = async (
  userId?: number
): Promise<Notification[]> => {
  const hasUser = userId !== undefined;
  const whereMap: Record<string, () => Promise<Notification[]>> = {
    true: async () =>
      prisma.notification.findMany({
        where: { userId: userId as number },
        orderBy: { createdAt: "desc" },
      }),
    false: async () =>
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
      }),
  };

  return whereMap[String(hasUser)]();
};

export const findUserNotifications = async (
  userId: number
): Promise<Notification[]> => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const findNotificationById = async (
  id: number
): Promise<Notification> => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  const exists = notification !== null;
  const notificationResolvers: Record<string, () => Notification> = {
    true: () => notification as Notification,
    false: () => {
      throw new Error("Notification introuvable");
    },
  };

  return notificationResolvers[String(exists)]();
};

export const createNotification = async (
  dto: CreateNotificationDto
): Promise<Notification> => {
  return prisma.notification.create({
    data: {
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      content: dto.content || "",
      linkUrl: dto.linkUrl || "",
    },
  });
};

export const markNotificationAsRead = async (
  id: number
): Promise<Notification> => {
  return prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

export const deleteNotification = async (
  id: number
): Promise<Notification> => {
  return prisma.notification.delete({
    where: { id },
  });
};
