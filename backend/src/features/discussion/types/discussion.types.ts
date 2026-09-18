/**
 * @file discussion.types.ts
 * @description Types specifiques a la messagerie securisee.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Discussion, Message, Patient, Doctor, User } from "@prisma/client";

export type DiscussionFull = Discussion & {
  readonly doctor: Doctor & { user: User };
  readonly patient: Patient & { user: User };
  readonly messages: Message[];
};
