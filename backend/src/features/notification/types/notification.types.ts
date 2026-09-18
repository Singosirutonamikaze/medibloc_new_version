/**
 * @file notification.types.ts
 * @description Types d'alias pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Notification, User } from "@prisma/client";

export type NotificationFull = Notification & {
  readonly user: User;
};
