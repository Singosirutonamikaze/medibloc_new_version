import { Request, Response } from 'express';
import { Disease, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type DiseaseCreateInput = Prisma.DiseaseCreateInput;
type DiseaseUpdateInput = Prisma.DiseaseUpdateInput;

export class DiseaseController {
  private readonly generic: GenericController<Disease, DiseaseCreateInput, DiseaseUpdateInput>;

  public getAllDiseases: (req: Request, res: Response) => Promise<Response>;
  public createDisease: (req: Request, res: Response) => Promise<Response>;
  public getDiseaseById: (req: Request, res: Response) => Promise<Response>;
  public updateDisease: (req: Request, res: Response) => Promise<Response>;
  public deleteDisease: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.DiseaseFindManyArgs) =>
        prisma.disease.findMany(params),
      findUnique: (params: Prisma.DiseaseFindUniqueArgs) =>
        prisma.disease.findUnique(params),
      create: (params: { data: DiseaseCreateInput }) =>
        prisma.disease.create({ data: params.data }),
      update: (params: { where: { id: number }; data: DiseaseUpdateInput }) =>
        prisma.disease.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.disease.delete({ where: params.where }),
      count: (params?: Prisma.DiseaseCountArgs) =>
        prisma.disease.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllDiseases = this.generic.getAll;
    this.createDisease = this.generic.create;
    this.getDiseaseById = this.generic.getOne;
    this.updateDisease = this.generic.update;
    this.deleteDisease = this.generic.delete;
  }

  public getDiseaseSymptoms = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prisma.DiseaseSymptomGetPayload<{ include: { symptom: true } }>[] | null> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const disease = await prisma.disease.findUnique({ where: { id }, include: { symptoms: { include: { symptom: true } } } });
        if (disease) {
          response = { success: true, data: disease.symptoms };
        } else {
          status = 404;
          response = { success: false, error: 'Maladie non trouvée' };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getDiseaseCountries = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prisma.CountryGetPayload<{}>[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const countries = await prisma.country.findMany({ where: { diseasesPresent: { some: { diseaseId: id } } } });
        response = { success: true, data: countries };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public addSymptomToDisease = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Disease | null> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      const symptomId = Number(req.params.symptomId);
      if (!id || id <= 0 || !symptomId || symptomId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiants invalides' };
      } else {
        const updated = await prisma.disease.update({ where: { id }, data: { symptoms: { connect: { id: symptomId } } } });
        response = { success: true, data: updated };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public removeSymptomFromDisease = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      const symptomId = Number(req.params.symptomId);
      if (!id || id <= 0 || !symptomId || symptomId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiants invalides' };
      } else {
        const updated = await prisma.disease.update({ where: { id }, data: { symptoms: { disconnect: { id: symptomId } } } as any });
        response = { success: true, data: updated };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
