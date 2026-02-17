import { describe, it, expect } from 'vitest';
import { patientsService } from '../../../services/api/patients/patients.service';

describe('Patients Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof patientsService.getAll).toBe('function');
    expect(typeof patientsService.getById).toBe('function');
    expect(typeof patientsService.create).toBe('function');
    expect(typeof patientsService.update).toBe('function');
    expect(typeof patientsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques patients', () => {
    expect(typeof patientsService.getAppointments).toBe('function');
    expect(typeof patientsService.getPrescriptions).toBe('function');
    expect(typeof patientsService.getDiseases).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(patientsService).toBeDefined();
  });
});
