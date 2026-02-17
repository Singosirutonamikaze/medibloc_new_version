import { describe, it, expect } from 'vitest';
import type { Symptom, CreateSymptomDto } from '../../../types/symptom/symptom.types';

describe('Symptom Types', () => {
  it('devrait valider le type Symptom', () => {
    const symptom: Symptom = {
      id: 1,
      name: 'Fever',
      description: 'Elevated body temperature',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(symptom.id).toBe(1);
    expect(symptom.name).toBe('Fever');
  });

  it('devrait valider CreateSymptomDto', () => {
    const createDto: CreateSymptomDto = {
      name: 'Cough',
      description: 'Persistent cough',
    };

    expect(createDto.name).toBe('Cough');
  });
});
