/**
 * @file notification.interface.ts
 * @description Interfaces metiers pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Notification as PrismaNotification, User } from "@prisma/client";

export interface NotificationWithUser extends PrismaNotification {
  readonly user?: User;
}
