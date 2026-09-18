/**
 * @file discussion.service.ts
 * @description Logique metier et persistance pour la messagerie et les fils de discussion.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Discussion, Message, Role } from "@prisma/client";
import { prisma } from "../../../core/configs/database/database.config";
import { CreateMessageDto } from "../dtos/discussion.dto";

const userSelect = {
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
  },
};

const discussionInclude = {
  doctor: { include: { user: userSelect } },
  patient: { include: { user: userSelect } },
  messages: { orderBy: { sentAt: "asc" as const } },
};

export const findAllDiscussions = async (params: {
  patientId?: number;
  doctorId?: number;
}): Promise<Discussion[]> => {
  const where: Record<string, number> = {};
  const hasPatient = params.patientId !== undefined;
  const hasDoctor = params.doctorId !== undefined;

  const patientMap: Record<string, () => void> = {
    true: () => {
      where.patientId = params.patientId as number;
    },
    false: () => undefined,
  };
  patientMap[String(hasPatient)]();

  const doctorMap: Record<string, () => void> = {
    true: () => {
      where.doctorId = params.doctorId as number;
    },
    false: () => undefined,
  };
  doctorMap[String(hasDoctor)]();

  return prisma.discussion.findMany({
    where,
    include: discussionInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const findDiscussionById = async (id: number): Promise<Discussion> => {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: discussionInclude,
  });

  const exists = discussion !== null;
  const discussionResolvers: Record<string, () => Discussion> = {
    true: () => discussion as Discussion,
    false: () => {
      throw new Error("Discussion introuvable");
    },
  };

  return discussionResolvers[String(exists)]();
};

export const getOrCreateDiscussion = async (
  patientId: number,
  doctorId: number
): Promise<Discussion> => {
  return prisma.discussion.upsert({
    where: {
      patientId_doctorId: { patientId, doctorId },
    },
    update: {},
    create: {
      patientId,
      doctorId,
    },
    include: discussionInclude,
  });
};

export const findDiscussionMessages = async (
  discussionId: number
): Promise<Message[]> => {
  return prisma.message.findMany({
    where: { discussionId },
    orderBy: { sentAt: "asc" },
  });
};

export const createMessageInDiscussion = async (
  discussionId: number,
  dto: CreateMessageDto
): Promise<Message> => {
  return prisma.message.create({
    data: {
      discussionId,
      senderRole: dto.senderRole,
      content: dto.content || "",
      fileUrl: dto.fileUrl || "",
    },
  });
};

export const markMessagesAsReadInDiscussion = async (
  discussionId: number,
  readerRole: Role
): Promise<number> => {
  const targetSenderRole = readerRole === "PATIENT" ? "DOCTOR" : "PATIENT";
  const updated = await prisma.message.updateMany({
    where: {
      discussionId,
      senderRole: targetSenderRole,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return updated.count;
};
