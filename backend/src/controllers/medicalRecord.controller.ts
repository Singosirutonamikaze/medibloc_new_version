import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type MRCreate = unknown;
type MRUpdate = unknown;

export class MedicalRecordController {
  private generic: GenericController<unknown, MRCreate, MRUpdate>;

  public getAllMedicalRecords: (req: Request, res: Response) => Promise<Response>;
  public createMedicalRecord: (req: Request, res: Response) => Promise<Response>;
  public getMedicalRecordById: (req: Request, res: Response) => Promise<Response>;
  public updateMedicalRecord: (req: Request, res: Response) => Promise<Response>;
  public deleteMedicalRecord: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.medicalRecord.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.medicalRecord.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: MRCreate }) => prisma.medicalRecord.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: MRUpdate }) =>
        prisma.medicalRecord.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.medicalRecord.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.medicalRecord.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllMedicalRecords = this.generic.getAll;
    this.createMedicalRecord = this.generic.create;
    this.getMedicalRecordById = this.generic.getOne;
    this.updateMedicalRecord = this.generic.update;
    this.deleteMedicalRecord = this.generic.delete;
  }

  public getPatientMedicalRecords = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de patient invalide' } as ApiResponse<unknown[]>;
      } else {
        const records = await prisma.medicalRecord.findMany({ where: { patientId } as any });
        response = { success: true, data: records };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}
