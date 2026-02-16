import { Request, Response } from 'express';
import { Prescription, Prisma } from '@prisma/client';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PrescriptionCreateInput = Prisma.PrescriptionCreateInput;
type PrescriptionUpdateInput = Prisma.PrescriptionUpdateInput;

export class PrescriptionController {
  private readonly generic: GenericController<Prescription, PrescriptionCreateInput, PrescriptionUpdateInput>;

  public getAllPrescriptions: (req: Request, res: Response) => Promise<Response>;
  public createPrescription: (req: Request, res: Response) => Promise<Response>;
  public getPrescriptionById: (req: Request, res: Response) => Promise<Response>;
  public updatePrescription: (req: Request, res: Response) => Promise<Response>;
  public deletePrescription: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: Prisma.PrescriptionFindManyArgs) =>
        prisma.prescription.findMany(params),
      findUnique: (params: Prisma.PrescriptionFindUniqueArgs) =>
        prisma.prescription.findUnique(params),
      create: (params: { data: PrescriptionCreateInput }) =>
        prisma.prescription.create({ data: params.data }),
      update: (params: { where: { id: number }; data: PrescriptionUpdateInput }) =>
        prisma.prescription.update({ where: params.where, data: params.data }),
      delete: (params: { where: { id: number } }) =>
        prisma.prescription.delete({ where: params.where }),
      count: (params?: Prisma.PrescriptionCountArgs) =>
        prisma.prescription.count(params),
    };

    this.generic = new GenericController(repo);

    this.getAllPrescriptions = this.generic.getAll;
    this.createPrescription = this.generic.create;
    this.getPrescriptionById = this.generic.getOne;
    this.updatePrescription = this.generic.update;
    this.deletePrescription = this.generic.delete;
  }

  public getPatientPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prescription[]> = { success: true, data: [] };
    try {
      const patientId = Number(req.params.patientId);
      if (!patientId || patientId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de patient invalide' };
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { patientId } });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getDoctorPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<Prescription[]> = { success: true, data: [] };
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId || doctorId <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant de médecin invalide' };
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { doctorId } });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
