/**
 * @file notification.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  notificationsQuery,
  notificationQuery,
} from "../queries/notification.queries";
import {
  createNotificationMutation,
  markNotificationAsReadMutation,
  deleteNotificationMutation,
} from "../mutations/notification.mutations";

export const notificationResolvers = {
  Query: {
    notifications: notificationsQuery,
    notification: notificationQuery,
  },
  Mutation: {
    createNotification: createNotificationMutation,
    markNotificationAsRead: markNotificationAsReadMutation,
    deleteNotification: deleteNotificationMutation,
  },
};

export default notificationResolvers;
