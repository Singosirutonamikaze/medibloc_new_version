import { describe, it, expect } from 'vitest';
import { appointmentsService } from '../../../services/api/appointments/appointments.service';

describe('Appointments Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof appointmentsService.getAll).toBe('function');
    expect(typeof appointmentsService.getById).toBe('function');
    expect(typeof appointmentsService.create).toBe('function');
    expect(typeof appointmentsService.update).toBe('function');
    expect(typeof appointmentsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques appointments', () => {
    expect(typeof appointmentsService.getByPatient).toBe('function');
    expect(typeof appointmentsService.getByDoctor).toBe('function');
    expect(typeof appointmentsService.updateStatus).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(appointmentsService).toBeDefined();
  });
});
