/**
 * @file notification.dto.ts
 * @description Objets de transfert de donnees pour les notifications utilisateurs.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { NotificationType } from "@prisma/client";

export interface CreateNotificationDto {
  readonly userId: number;
  readonly type: NotificationType;
  readonly title: string;
  readonly content?: string;
  readonly linkUrl?: string;
}

export interface MarkNotificationReadDto {
  readonly notificationId: number;
}
