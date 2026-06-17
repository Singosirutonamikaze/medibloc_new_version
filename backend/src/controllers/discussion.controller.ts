import { Request, Response } from "express";
import { Discussion, Message, Prisma } from "@prisma/client";
import prisma from "../config/database";
import GenericController from "../gen/generic.controller";
import { ApiResponse } from "../types";

type DiscussionCreateInput = Prisma.DiscussionCreateInput;
type DiscussionUpdateInput = Prisma.DiscussionUpdateInput;

export class DiscussionController {
  private readonly generic: GenericController<
    Discussion,
    DiscussionCreateInput,
    DiscussionUpdateInput
  >;

  public getAllDiscussions: (req: Request, res: Response) => Promise<Response>;
  public getDiscussionById: (req: Request, res: Response) => Promise<Response>;
  public deleteDiscussion: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.DiscussionFindManyArgs) =>
        prisma.discussion.findMany({
          ...params,
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            messages: { orderBy: { sentAt: "desc" }, take: 1 },
          },
        }),
      findUnique: (params: Prisma.DiscussionFindUniqueArgs) =>
        prisma.discussion.findUnique({
          ...params,
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            messages: { orderBy: { sentAt: "asc" } },
          },
        }),
      create: (params: { data: DiscussionCreateInput }) =>
        prisma.discussion.create({ data: params.data }),
      update: (params: {
        where: { id: number };
        data: DiscussionUpdateInput;
      }) =>
        prisma.discussion.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.discussion.delete({ where: params.where }),
      count: (params?: Prisma.DiscussionCountArgs) =>
        prisma.discussion.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllDiscussions = this.generic.getAll;
    this.getDiscussionById = this.generic.getOne;
    this.deleteDiscussion = this.generic.delete;
  }

  // Find or create discussion between patient and doctor
  public getOrCreateDiscussion = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Discussion> = { success: true };
    try {
      const patientId = Number(req.body.patientId);
      const doctorId = Number(req.body.doctorId);
      if (!patientId || !doctorId) {
        status = 400;
        response = {
          success: false,
          error: "patientId et doctorId sont requis",
        };
      } else {
        let discussion = await prisma.discussion.findUnique({
          where: {
            patientId_doctorId: { patientId, doctorId },
          },
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        });

        if (!discussion) {
          discussion = await prisma.discussion.create({
            data: { patientId, doctorId },
            include: {
              doctor: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
              patient: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          });
          status = 201;
        }

        response = { success: true, data: discussion };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Get user discussions (by patientId or doctorId)
  public getUserDiscussions = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Discussion[]> = { success: true, data: [] };
    try {
      const patientId = req.query.patientId
        ? Number(req.query.patientId)
        : undefined;
      const doctorId = req.query.doctorId
        ? Number(req.query.doctorId)
        : undefined;

      const whereClause: Prisma.DiscussionWhereInput = {};
      if (patientId) whereClause.patientId = patientId;
      if (doctorId) whereClause.doctorId = doctorId;

      const discussions = await prisma.discussion.findMany({
        where: whereClause,
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          messages: { orderBy: { sentAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      });

      response = { success: true, data: discussions };
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Get messages for a discussion
  public getDiscussionMessages = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Message[]> = { success: true, data: [] };
    try {
      const discussionId = Number(req.params.id);
      if (discussionId) {
        const messages = await prisma.message.findMany({
          where: { discussionId },
          orderBy: { sentAt: "asc" },
        });
        response = { success: true, data: messages };
      } else {
        status = 400;
        response = { success: false, error: "ID de discussion invalide" };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Create message in a discussion
  public createMessage = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 201;
    let response: ApiResponse<Message> = { success: true };
    try {
      const discussionId = Number(req.params.id);
      const { senderRole, content, fileUrl } = req.body;

      if (!discussionId || !senderRole) {
        status = 400;
        response = { success: false, error: "Données manquantes" };
      } else {
        const message = await prisma.message.create({
          data: {
            discussionId,
            senderRole,
            content,
            fileUrl,
          },
        });
        response = { success: true, data: message };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };

  // Mark all messages in discussion as read
  public markDiscussionMessagesAsRead = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<{ count: number }> = { success: true };
    try {
      const discussionId = Number(req.params.id);
      const { role } = req.body;

      if (!discussionId || !role) {
        status = 400;
        response = {
          success: false,
          error: "discussionId et rôle sont requis",
        };
      } else {
        const targetRole = role === "PATIENT" ? "DOCTOR" : "PATIENT";
        const updated = await prisma.message.updateMany({
          where: {
            discussionId,
            senderRole: targetRole,
            isRead: false,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
        response = { success: true, data: { count: updated.count } };
      }
    } catch (err: unknown) {
      status = 500;
      response = {
        success: false,
        error: err instanceof Error ? err.message : "Erreur interne",
      };
    }
    return res.status(status).json(response);
  };
}
