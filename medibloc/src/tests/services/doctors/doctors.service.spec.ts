import { describe, it, expect } from 'vitest';
import { doctorsService } from '../../../services/api/doctors/doctors.service';

describe('Doctors Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof doctorsService.getAll).toBe('function');
    expect(typeof doctorsService.getById).toBe('function');
    expect(typeof doctorsService.create).toBe('function');
    expect(typeof doctorsService.update).toBe('function');
    expect(typeof doctorsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques doctors', () => {
    expect(typeof doctorsService.getAppointments).toBe('function');
    expect(typeof doctorsService.getPrescriptions).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(doctorsService).toBeDefined();
  });
});
