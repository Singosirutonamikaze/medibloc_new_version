import { describe, it, expect } from 'vitest';
import type { Doctor, CreateDoctorDto } from '../../../types/doctor/doctor.types';

describe('Doctor Types', () => {
  it('devrait valider le type Doctor', () => {
    const doctor: Doctor = {
      id: 1,
      userId: 1,
      specialty: 'Cardiology',
    };

    expect(doctor.id).toBe(1);
    expect(doctor.specialty).toBe('Cardiology');
  });

  it('devrait valider CreateDoctorDto', () => {
    const createDto: CreateDoctorDto = {
      userId: 1,
      specialty: 'Neurology',
    };

    expect(createDto.specialty).toBe('Neurology');
  });
});

