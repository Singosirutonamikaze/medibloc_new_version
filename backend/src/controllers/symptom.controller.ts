import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type SymptomCreate = unknown;
type SymptomUpdate = unknown;

export class SymptomController {
  private generic: GenericController<unknown, SymptomCreate, SymptomUpdate>;

  public getAllSymptoms: (req: Request, res: Response) => Promise<Response>;
  public createSymptom: (req: Request, res: Response) => Promise<Response>;
  public getSymptomById: (req: Request, res: Response) => Promise<Response>;
  public updateSymptom: (req: Request, res: Response) => Promise<Response>;
  public deleteSymptom: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.symptom.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.symptom.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: SymptomCreate }) => prisma.symptom.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: SymptomUpdate }) =>
        prisma.symptom.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.symptom.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.symptom.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllSymptoms = this.generic.getAll;
    this.createSymptom = this.generic.create;
    this.getSymptomById = this.generic.getOne;
    this.updateSymptom = this.generic.update;
    this.deleteSymptom = this.generic.delete;
  }

  public getSymptomDiseases = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        // Relation name may vary; use a safe any cast for now
        const diseases = await prisma.disease.findMany({ where: { symptoms: { some: { id } } } as any });
        response = { success: true, data: diseases };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}
