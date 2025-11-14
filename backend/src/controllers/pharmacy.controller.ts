import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PharmacyCreate = unknown;
type PharmacyUpdate = unknown;

export class PharmacyController {
  private generic: GenericController<unknown, PharmacyCreate, PharmacyUpdate>;

  public getAllPharmacies: (req: Request, res: Response) => Promise<Response>;
  public createPharmacy: (req: Request, res: Response) => Promise<Response>;
  public getPharmacyById: (req: Request, res: Response) => Promise<Response>;
  public updatePharmacy: (req: Request, res: Response) => Promise<Response>;
  public deletePharmacy: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.pharmacy.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.pharmacy.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: PharmacyCreate }) => prisma.pharmacy.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: PharmacyUpdate }) =>
        prisma.pharmacy.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.pharmacy.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.pharmacy.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllPharmacies = this.generic.getAll;
    this.createPharmacy = this.generic.create;
    this.getPharmacyById = this.generic.getOne;
    this.updatePharmacy = this.generic.update;
    this.deletePharmacy = this.generic.delete;
  }

  public getPharmaciesByCountry = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const countryId = Number(req.params.countryId);
      if (!countryId || countryId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        const pharmacies = await prisma.pharmacy.findMany({ where: { countryId } });
        response = { success: true, data: pharmacies };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };

  public getPharmacyMedicines = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        const medicines = await prisma.medicine.findMany({ where: { pharmacyId: id } });
        response = { success: true, data: medicines };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}
