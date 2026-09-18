/**
 * @file notification.queries.ts
 * @description Requetes GraphQL pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Notification } from "@prisma/client";
import {
  findAllNotifications,
  findNotificationById,
} from "../../services/notification.service";

export const notificationsQuery = async (
  _parent: void,
  args?: { userId?: number }
): Promise<Notification[]> => {
  return findAllNotifications(args ? args.userId : undefined);
};

export const notificationQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Notification> => {
  return findNotificationById(args.id);
};
