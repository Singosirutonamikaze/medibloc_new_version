import { Request, Response } from 'express';
import { Medicine, MedicineType, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse, CreateMedicineDto, UpdateMedicineDto } from '../types';

type MedicineCreateInput = Prisma.MedicineCreateInput;
type MedicineUpdateInput = Prisma.MedicineUpdateInput;

export class MedicineController {
  private generic: GenericController<Medicine, MedicineCreateInput, MedicineUpdateInput>;

  public getAllMedicines: (req: Request, res: Response) => Promise<Response>;
  public createMedicine: (req: Request, res: Response) => Promise<Response>;
  public getMedicineById: (req: Request, res: Response) => Promise<Response>;
  public updateMedicine: (req: Request, res: Response) => Promise<Response>;
  public deleteMedicine: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.MedicineFindManyArgs) =>
        prisma.medicine.findMany(params),
      findUnique: (params: Prisma.MedicineFindUniqueArgs) =>
        prisma.medicine.findUnique(params),
      create: (params: { data: MedicineCreateInput }) =>
        prisma.medicine.create({ data: params.data }),
      update: (params: { where: { id: number }; data: MedicineUpdateInput }) =>
        prisma.medicine.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.medicine.delete({ where: params.where }),
      count: (params?: Prisma.MedicineCountArgs) =>
        prisma.medicine.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllMedicines = this.generic.getAll;
    this.createMedicine = this.generic.create;
    this.getMedicineById = this.generic.getOne;
    this.updateMedicine = this.generic.update;
    this.deleteMedicine = this.generic.delete;
  }

  public getMedicinesByType = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Medicine[]> = { success: true, data: [] };
    try {
      const type = req.params.type as MedicineType;
      const medicines = await prisma.medicine.findMany({ where: { type } });
      response = { success: true, data: medicines };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getMedicinesByPharmacy = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Medicine[]> = { success: true, data: [] };
    try {
      const pharmacyId = Number(req.params.pharmacyId);
      if (!pharmacyId || pharmacyId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const medicines = await prisma.medicine.findMany({ where: { pharmacyId } });
        response = { success: true, data: medicines };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
