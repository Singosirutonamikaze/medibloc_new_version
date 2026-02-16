import { Request, Response } from 'express';
import { Symptom, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type SymptomCreateInput = Prisma.SymptomCreateInput;
type SymptomUpdateInput = Prisma.SymptomUpdateInput;

export class SymptomController {
  private readonly generic: GenericController<Symptom, SymptomCreateInput, SymptomUpdateInput>;

  public getAllSymptoms: (req: Request, res: Response) => Promise<Response>;
  public createSymptom: (req: Request, res: Response) => Promise<Response>;
  public getSymptomById: (req: Request, res: Response) => Promise<Response>;
  public updateSymptom: (req: Request, res: Response) => Promise<Response>;
  public deleteSymptom: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.SymptomFindManyArgs) =>
        prisma.symptom.findMany(params),
      findUnique: (params: Prisma.SymptomFindUniqueArgs) =>
        prisma.symptom.findUnique(params),
      create: (params: { data: SymptomCreateInput }) =>
        prisma.symptom.create({ data: params.data }),
      update: (params: { where: { id: number }; data: SymptomUpdateInput }) =>
        prisma.symptom.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.symptom.delete({ where: params.where }),
      count: (params?: Prisma.SymptomCountArgs) =>
        prisma.symptom.count(params),
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
    let response: ApiResponse<Prisma.DiseaseGetPayload<{}>[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const diseases = await prisma.disease.findMany({
          where: { symptoms: { some: { symptomId: id } } }
        });
        response = { success: true, data: diseases };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
