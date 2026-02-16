import { Request, Response } from 'express';
import { MedicalRecord, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse, CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../types';

type MedicalRecordCreateInput = Prisma.MedicalRecordCreateInput;
type MedicalRecordUpdateInput = Prisma.MedicalRecordUpdateInput;

export class MedicalRecordController {
  private generic: GenericController<MedicalRecord, MedicalRecordCreateInput, MedicalRecordUpdateInput>;

  public getAllMedicalRecords: (req: Request, res: Response) => Promise<Response>;
  public createMedicalRecord: (req: Request, res: Response) => Promise<Response>;
  public getMedicalRecordById: (req: Request, res: Response) => Promise<Response>;
  public updateMedicalRecord: (req: Request, res: Response) => Promise<Response>;
  public deleteMedicalRecord: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.MedicalRecordFindManyArgs) =>
        prisma.medicalRecord.findMany(params),
      findUnique: (params: Prisma.MedicalRecordFindUniqueArgs) =>
        prisma.medicalRecord.findUnique(params),
      create: (params: { data: MedicalRecordCreateInput }) =>
        prisma.medicalRecord.create({ data: params.data }),
      update: (params: { where: { id: number }; data: MedicalRecordUpdateInput }) =>
        prisma.medicalRecord.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.medicalRecord.delete({ where: params.where }),
      count: (params?: Prisma.MedicalRecordCountArgs) =>
        prisma.medicalRecord.count(params),
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
    let response: ApiResponse<MedicalRecord[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de patient invalide' };
      } else {
        const records = await prisma.medicalRecord.findMany({ where: { patientId } });
        response = { success: true, data: records };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
