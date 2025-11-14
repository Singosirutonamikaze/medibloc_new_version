import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type DiseaseCreate = unknown;
type DiseaseUpdate = unknown;

export class DiseaseController {
  private generic: GenericController<unknown, DiseaseCreate, DiseaseUpdate>;

  public getAllDiseases: (req: Request, res: Response) => Promise<Response>;
  public createDisease: (req: Request, res: Response) => Promise<Response>;
  public getDiseaseById: (req: Request, res: Response) => Promise<Response>;
  public updateDisease: (req: Request, res: Response) => Promise<Response>;
  public deleteDisease: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.disease.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.disease.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: DiseaseCreate }) => prisma.disease.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: DiseaseUpdate }) =>
        prisma.disease.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.disease.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.disease.count({ where: params?.where as any }),
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
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const disease = await prisma.disease.findUnique({ where: { id }, include: { symptoms: true } as any });
        if (!disease) {
          status = 404;
          response = { success: false, error: 'Maladie non trouvée' };
        } else {
          response = { success: true, data: disease.symptoms };
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
    let response: ApiResponse<unknown> = { success: true, data: null };
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
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      const symptomId = Number(req.params.symptomId);
      if (!id || id <= 0 || !symptomId || symptomId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiants invalides' };
      } else {
        const updated = await prisma.disease.update({ where: { id }, data: { symptoms: { connect: { id: symptomId } } } as any });
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
