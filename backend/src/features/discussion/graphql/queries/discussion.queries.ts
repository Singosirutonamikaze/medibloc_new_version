/**
 * @file discussion.queries.ts
 * @description Requetes GraphQL pour la messagerie et discussions.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Discussion, Message } from "@prisma/client";
import {
  findAllDiscussions,
  findDiscussionById,
  findDiscussionMessages,
} from "../../services/discussion.service";

export const discussionsQuery = async (
  _parent: void,
  args?: { patientId?: number; doctorId?: number }
): Promise<Discussion[]> => {
  return findAllDiscussions({
    patientId: args ? args.patientId : undefined,
    doctorId: args ? args.doctorId : undefined,
  });
};

export const discussionQuery = async (
  _parent: void,
  args: { id: number }
): Promise<Discussion> => {
  return findDiscussionById(args.id);
};

export const discussionMessagesQuery = async (
  _parent: void,
  args: { discussionId: number }
): Promise<Message[]> => {
  return findDiscussionMessages(args.discussionId);
};
