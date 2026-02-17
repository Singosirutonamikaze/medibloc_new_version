import type { DiseaseSeverity, DiseaseStatus } from '../common/common.types';

export interface Disease {
  id: number;
  name: string;
  description?: string;
  treatment?: string;
  prevention?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiseaseDto {
  name: string;
  description?: string;
  treatment?: string;
  prevention?: string;
  category?: string;
}

export interface UpdateDiseaseDto {
  name?: string;
  description?: string;
  treatment?: string;
  prevention?: string;
  category?: string;
}

export interface PatientDisease {
  id: number;
  patientId: number;
  diseaseId: number;
  diagnosedAt: string;
  status: DiseaseStatus;
  severity: DiseaseSeverity;
  notes?: string;
  disease?: Disease;
}
