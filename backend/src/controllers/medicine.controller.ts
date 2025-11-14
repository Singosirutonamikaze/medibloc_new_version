import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type MedicineCreate = unknown;
type MedicineUpdate = unknown;

export class MedicineController {
  private generic: GenericController<unknown, MedicineCreate, MedicineUpdate>;

  public getAllMedicines: (req: Request, res: Response) => Promise<Response>;
  public createMedicine: (req: Request, res: Response) => Promise<Response>;
  public getMedicineById: (req: Request, res: Response) => Promise<Response>;
  public updateMedicine: (req: Request, res: Response) => Promise<Response>;
  public deleteMedicine: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.medicine.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.medicine.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: MedicineCreate }) => prisma.medicine.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: MedicineUpdate }) =>
        prisma.medicine.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.medicine.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.medicine.count({ where: params?.where as any }),
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
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const type = req.params.type;
      const medicines = await prisma.medicine.findMany({ where: { type: type as any } });
      response = { success: true, data: medicines };
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };

  public getMedicinesByPharmacy = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown[]> = { success: true, data: [] };
    try {
      const pharmacyId = Number(req.params.pharmacyId);
      if (!pharmacyId || pharmacyId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' } as ApiResponse<unknown[]>;
      } else {
        const medicines = await prisma.medicine.findMany({ where: { pharmacyId } });
        response = { success: true, data: medicines };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' } as ApiResponse<unknown[]>;
    }

    return res.status(status).json(response);
  };
}
