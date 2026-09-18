/**
 * @file notification.schema.ts
 * @description Schema GraphQL SDL pour les notifications.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

export const notificationTypeDefs = `#graphql
  enum NotificationType {
    APPOINTMENT_REMINDER
    PRESCRIPTION_READY
    NEW_MESSAGE
    INVOICE_PENDING
    SYSTEM_ALERT
  }

  type Notification {
    id: Int!
    userId: Int!
    type: NotificationType!
    title: String!
    content: String
    linkUrl: String
    isRead: Boolean!
    readAt: String
    createdAt: String!
  }

  input CreateNotificationInput {
    userId: Int!
    type: NotificationType!
    title: String!
    content: String
    linkUrl: String
  }

  extend type Query {
    notifications: [Notification!]!
    notification(id: Int!): Notification
  }

  extend type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!
    markNotificationAsRead(id: Int!): Notification!
    deleteNotification(id: Int!): Notification!
  }
`;
