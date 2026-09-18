/**
 * @file discussion.resolver.ts
 * @description Agregateur des resolveurs GraphQL pour les discussions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import {
  discussionsQuery,
  discussionQuery,
  discussionMessagesQuery,
} from "../queries/discussion.queries";
import {
  sendMessageMutation,
  markMessagesAsReadMutation,
} from "../mutations/discussion.mutations";

export const discussionResolvers = {
  Query: {
    discussions: discussionsQuery,
    discussion: discussionQuery,
    discussionMessages: discussionMessagesQuery,
  },
  Mutation: {
    sendMessage: sendMessageMutation,
    markMessagesAsRead: markMessagesAsReadMutation,
  },
};

export default discussionResolvers;
