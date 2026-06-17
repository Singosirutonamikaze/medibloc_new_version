import type { NotificationType } from '../common/common.types';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  content?: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  content?: string;
  linkUrl?: string;
}
