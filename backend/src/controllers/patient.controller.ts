import { Request, Response } from 'express';
import prisma from '../config/database';
import GenericController from '../gen/generic.controller';
import { ApiResponse } from '../types';

type PatientCreate = unknown;
type PatientUpdate = unknown;

export class PatientController {
  private generic: GenericController<unknown, PatientCreate, PatientUpdate>;

  public getAllPatients: (req: Request, res: Response) => Promise<Response>;
  public createPatient: (req: Request, res: Response) => Promise<Response>;
  public getPatientById: (req: Request, res: Response) => Promise<Response>;
  public updatePatient: (req: Request, res: Response) => Promise<Response>;
  public deletePatient: (req: Request, res: Response) => Promise<Response>;

  constructor() {
    const repo = {
      findMany: (params?: { where?: Record<string, unknown>; skip?: number; take?: number; include?: Record<string, unknown> }) =>
        prisma.patient.findMany({ where: params?.where as any, skip: params?.skip, take: params?.take, include: params?.include as any }),
      findUnique: (params: { where: { id: number }; include?: Record<string, unknown> }) =>
        prisma.patient.findUnique({ where: params.where as any, include: params.include as any }),
      create: (params: { data: PatientCreate }) => prisma.patient.create({ data: params.data as any }),
      update: (params: { where: { id: number }; data: PatientUpdate }) =>
        prisma.patient.update({ where: params.where as any, data: params.data as any }),
      delete: (params: { where: { id: number } }) => prisma.patient.delete({ where: params.where as any }),
      count: (params?: { where?: Record<string, unknown> }) => prisma.patient.count({ where: params?.where as any }),
    };

    this.generic = new GenericController(repo);

    this.getAllPatients = this.generic.getAll;
    this.createPatient = this.generic.create;
    this.getPatientById = this.generic.getOne;
    this.updatePatient = this.generic.update;
    this.deletePatient = this.generic.delete;
  }

  public getPatientDiseases = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const patient = await prisma.patient.findUnique({ where: { id }, include: { diseases: true } as any });
        if (!patient) {
          status = 404;
          response = { success: false, error: 'Patient non trouvé' };
        } else {
          response = { success: true, data: patient.diseases };
        }
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientAppointments = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const appointments = await prisma.appointment.findMany({ where: { patientId: id } });
        response = { success: true, data: appointments };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };

  public getPatientPrescriptions = async (req: Request, res: Response): Promise<Response> => {
    let status = 200;
    let response: ApiResponse<unknown> = { success: true, data: null };
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) {
        status = 400;
        response = { success: false, error: 'Identifiant invalide' };
      } else {
        const prescriptions = await prisma.prescription.findMany({ where: { patientId: id } });
        response = { success: true, data: prescriptions };
      }
    } catch (err: unknown) {
      status = 500;
      response = { success: false, error: err instanceof Error ? err.message : 'Erreur interne' };
    }

    return res.status(status).json(response);
  };
}
