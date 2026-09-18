/**
 * @file discussion.interface.ts
 * @description Interfaces pour les echanges de messagerie entre praticiens et patients.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Discussion as PrismaDiscussion, Message, Patient, Doctor } from "@prisma/client";

export interface DiscussionWithParticipants extends PrismaDiscussion {
  readonly patient?: Patient;
  readonly doctor?: Doctor;
  readonly messages?: Message[];
}
