import { Request, Response } from 'express';
import { Doctor, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type DoctorCreateInput = Prisma.DoctorCreateInput;
type DoctorUpdateInput = Prisma.DoctorUpdateInput;

export class DoctorController {
  private readonly generic: GenericController<Doctor, DoctorCreateInput, DoctorUpdateInput>;

  public getAllDoctors: (req: Request, res: Response) => Promise<Response>;
  public createDoctor: (req: Request, res: Response) => Promise<Response>;
  public getDoctorById: (req: Request, res: Response) => Promise<Response>;
  public updateDoctor: (req: Request, res: Response) => Promise<Response>;
  public deleteDoctor: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.DoctorFindManyArgs) =>
        prisma.doctor.findMany(params),
      findUnique: (params: Prisma.DoctorFindUniqueArgs) =>
        prisma.doctor.findUnique(params),
      create: (params: { data: DoctorCreateInput }) =>
        prisma.doctor.create({ data: params.data }),
      update: (params: { where: { id: number }; data: DoctorUpdateInput }) =>
        prisma.doctor.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.doctor.delete({ where: params.where }),
      count: (params?: Prisma.DoctorCountArgs) =>
        prisma.doctor.count(params),
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
      const specialties = Array.from(new Set(doctors.map((d: { specialty: string | null }) => d.specialty).filter(Boolean))) as string[];
      response = { success: true, data: specialties };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<string[]>;
    }

    return res.status(status).json(response);
  };
}
