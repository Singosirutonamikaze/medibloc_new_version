import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type DoctorCreate = unknown;
type DoctorUpdate = unknown;

export class DoctorController {
  private generic: GenericController<unknown, DoctorCreate, DoctorUpdate>;

  public getAllDoctors: (req: Request, res: Response) => Promise<Response>;
  public createDoctor: (req: Request, res: Response) => Promise<Response>;
  public getDoctorById: (req: Request, res: Response) => Promise<Response>;
  public updateDoctor: (req: Request, res: Response) => Promise<Response>;
  public deleteDoctor: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.doctor.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.doctor.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: DoctorCreate }) => prisma.doctor.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: DoctorUpdate }) =>
        prisma.doctor.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.doctor.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.doctor.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllDoctors = this.generic.getAll;
    this.createDoctor = this.generic.create;
    this.getDoctorById = this.generic.getOne;
    this.updateDoctor = this.generic.update;
    this.deleteDoctor = this.generic.delete;
  }

  public getDoctorAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const appointments = await prisma.appointment.findMany({ where: { doctorId: id } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getDoctorPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { doctorId: id } });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getSpecialties = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<string[]> = { success: true, data: [] };
    try {
      const doctors = await prisma.doctor.findMany({ select: { specialty: true } });
      const specialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean))) as string[];
      response = { success: true, data: specialties };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<string[]>;
    }

    return res.status(status).json(response);
  };
}
