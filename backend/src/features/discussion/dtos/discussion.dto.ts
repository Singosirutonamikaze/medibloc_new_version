/**
 * @file discussion.dto.ts
 * @description Objets de transfert de donnees pour la messagerie et les fils de discussion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Role } from "@prisma/client";

export interface CreateDiscussionDto {
  readonly patientId: number;
  readonly doctorId: number;
}

export interface CreateMessageDto {
  readonly senderRole: Role;
  readonly content?: string;
  readonly fileUrl?: string;
}

export interface MarkMessagesReadDto {
  readonly role: Role;
}
