/**
 * @file discussion.mutations.ts
 * @description Mutations GraphQL pour la messagerie et discussions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Message, Role } from "@prisma/client";
import {
  createMessageInDiscussion,
  markMessagesAsReadInDiscussion,
} from "../../services/discussion.service";

export const sendMessageMutation = async (
  _parent: void,
  args: {
    input: {
      discussionId: number;
      senderRole: Role;
      content?: string;
      fileUrl?: string;
    };
  }
): Promise<Message> => {
  return createMessageInDiscussion(args.input.discussionId, {
    senderRole: args.input.senderRole,
    content: args.input.content,
    fileUrl: args.input.fileUrl,
  });
};

export const markMessagesAsReadMutation = async (
  _parent: void,
  args: { discussionId: number; role: Role }
): Promise<number> => {
  return markMessagesAsReadInDiscussion(args.discussionId, args.role);
};
