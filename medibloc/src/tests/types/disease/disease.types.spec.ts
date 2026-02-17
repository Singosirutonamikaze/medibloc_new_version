import { describe, it, expect } from 'vitest';
import type { Disease, CreateDiseaseDto } from '../../../types/disease/disease.types';

describe('Disease Types', () => {
  it('devrait valider le type Disease', () => {
    const disease: Disease = {
      id: 1,
      name: 'Diabetes',
      description: 'Type 2 diabetes mellitus',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(disease.id).toBe(1);
    expect(disease.name).toBe('Diabetes');
  });

  it('devrait valider CreateDiseaseDto', () => {
    const createDto: CreateDiseaseDto = {
      name: 'Hypertension',
      description: 'High blood pressure',
    };

    expect(createDto.name).toBe('Hypertension');
  });
});

