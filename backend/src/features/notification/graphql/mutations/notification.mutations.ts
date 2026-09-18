/**
 * @file notification.mutations.ts
 * @description Mutations GraphQL pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Notification } from "@prisma/client";
import {
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../../services/notification.service";
import { CreateNotificationDto } from "../../dtos/notification.dto";

export const createNotificationMutation = async (
  _parent: void,
  args: { input: CreateNotificationDto }
): Promise<Notification> => {
  return createNotification(args.input);
};

export const markNotificationAsReadMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Notification> => {
  return markNotificationAsRead(args.id);
};

export const deleteNotificationMutation = async (
  _parent: void,
  args: { id: number }
): Promise<Notification> => {
  return deleteNotification(args.id);
};
