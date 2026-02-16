import { Request, Response } from 'express';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse, CreateAppointmentDto, UpdateAppointmentDto } from '../types';

type AppointmentCreateInput = Prisma.AppointmentCreateInput;
type AppointmentUpdateInput = Prisma.AppointmentUpdateInput;

export class AppointmentController {
  private generic: GenericController<Appointment, AppointmentCreateInput, AppointmentUpdateInput>;

  public getAllAppointments: (req: Request, res: Response) => Promise<Response>;
  public createAppointment: (req: Request, res: Response) => Promise<Response>;
  public getAppointmentById: (req: Request, res: Response) => Promise<Response>;
  public updateAppointment: (req: Request, res: Response) => Promise<Response>;
  public deleteAppointment: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.AppointmentFindManyArgs) =>
        prisma.appointment.findMany(params),
      findUnique: (params: Prisma.AppointmentFindUniqueArgs) =>
        prisma.appointment.findUnique(params),
      create: (params: { data: AppointmentCreateInput }) =>
        prisma.appointment.create({ data: params.data }),
      update: (params: { where: { id: number }; data: AppointmentUpdateInput }) =>
        prisma.appointment.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.appointment.delete({ where: params.where }),
      count: (params?: Prisma.AppointmentCountArgs) =>
        prisma.appointment.count(params),
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
    let response: ApiResponse<Appointment | null> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      const { status: newStatus } = req.body as { status?: AppointmentStatus };
      if (!id || id <= 0 || !newStatus) {
        status = 400;
        response = { success: false, error: 'Paramètres invalides' };
      } else {
        const updated = await prisma.appointment.update({ where: { id }, data: { status: newStatus } });
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
    let response: ApiResponse<Appointment[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const appointments = await prisma.appointment.findMany({ where: { patientId } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getDoctorAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Appointment[]> = { success: true, data: [] };
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId || doctorId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const appointments = await prisma.appointment.findMany({ where: { doctorId } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}