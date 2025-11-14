import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type AppointmentCreate = unknown;
type AppointmentUpdate = unknown;

export class AppointmentController {
  private generic: GenericController<unknown, AppointmentCreate, AppointmentUpdate>;

  public getAllAppointments: (req: Request, res: Response) => Promise<Response>;
  public createAppointment: (req: Request, res: Response) => Promise<Response>;
  public getAppointmentById: (req: Request, res: Response) => Promise<Response>;
  public updateAppointment: (req: Request, res: Response) => Promise<Response>;
  public deleteAppointment: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.appointment.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.appointment.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: AppointmentCreate }) => prisma.appointment.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: AppointmentUpdate }) =>
        prisma.appointment.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.appointment.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.appointment.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllAppointments = this.generic.getAll;
    this.createAppointment = this.generic.create;
    this.getAppointmentById = this.generic.getOne;
    this.updateAppointment = this.generic.update;
    this.deleteAppointment = this.generic.delete;
  }
  public updateAppointmentStatus = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown | null> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      const { status: newStatus } = req.body as { status?: string };
      if (!id || id <= 0 || !newStatus) {
        status = 400;
        response = { success: false, error: 'Paramètres invalides' };
      } else {
        const updated = await prisma.appointment.update({ where: { id }, data: { status: newStatus as any } });
        response = { success: true, data: updated };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        const appointments = await prisma.appointment.findMany({ where: { patientId } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };

  public getDoctorAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId || doctorId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        const appointments = await prisma.appointment.findMany({ where: { doctorId } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}