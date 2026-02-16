import { Request, Response } from 'express';
import { Pharmacy, Medicine, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PharmacyCreateInput = Prisma.PharmacyCreateInput;
type PharmacyUpdateInput = Prisma.PharmacyUpdateInput;

export class PharmacyController {
  private readonly generic: GenericController<Pharmacy, PharmacyCreateInput, PharmacyUpdateInput>;

  public getAllPharmacies: (req: Request, res: Response) => Promise<Response>;
  public createPharmacy: (req: Request, res: Response) => Promise<Response>;
  public getPharmacyById: (req: Request, res: Response) => Promise<Response>;
  public updatePharmacy: (req: Request, res: Response) => Promise<Response>;
  public deletePharmacy: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.PharmacyFindManyArgs) =>
        prisma.pharmacy.findMany(params),
      findUnique: (params: Prisma.PharmacyFindUniqueArgs) =>
        prisma.pharmacy.findUnique(params),
      create: (params: { data: PharmacyCreateInput }) =>
        prisma.pharmacy.create({ data: params.data }),
      update: (params: { where: { id: number }; data: PharmacyUpdateInput }) =>
        prisma.pharmacy.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.pharmacy.delete({ where: params.where }),
      count: (params?: Prisma.PharmacyCountArgs) =>
        prisma.pharmacy.count(params),
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
    let response: ApiResponse<Pharmacy[]> = { success: true, data: [] };
    try {
      const countryId = Number(req.params.countryId);
      if (!countryId || countryId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const pharmacies = await prisma.pharmacy.findMany({ where: { countryId } });
        response = { success: true, data: pharmacies };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPharmacyMedicines = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Medicine[]> = { success: true, data: [] };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const medicines = await prisma.medicine.findMany({ where: { pharmacyId: id } });
        response = { success: true, data: medicines };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
