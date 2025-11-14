import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PrescriptionCreate = unknown;
type PrescriptionUpdate = unknown;

export class PrescriptionController {
  private generic: GenericController<unknown, PrescriptionCreate, PrescriptionUpdate>;

  public getAllPrescriptions: (req: Request, res: Response) => Promise<Response>;
  public createPrescription: (req: Request, res: Response) => Promise<Response>;
  public getPrescriptionById: (req: Request, res: Response) => Promise<Response>;
  public updatePrescription: (req: Request, res: Response) => Promise<Response>;
  public deletePrescription: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.prescription.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.prescription.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: PrescriptionCreate }) => prisma.prescription.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: PrescriptionUpdate }) =>
        prisma.prescription.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.prescription.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.prescription.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllPrescriptions = this.generic.getAll;
    this.createPrescription = this.generic.create;
    this.getPrescriptionById = this.generic.getOne;
    this.updatePrescription = this.generic.update;
    this.deletePrescription = this.generic.delete;
  }

  public getPatientPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de patient invalide' } as ApiResponse<unknown[]>;
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { patientId } as any });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };

  public getDoctorPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId || doctorId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de médecin invalide' } as ApiResponse<unknown[]>;
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { doctorId } as any });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}
