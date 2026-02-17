import { describe, it, expect } from 'vitest';
import { prescriptionsService } from '../../../services/api/prescriptions/prescriptions.service';

describe('Prescriptions Service', () => {
  it('devrait avoir les methodes CRUD', () => {
    expect(typeof prescriptionsService.getAll).toBe('function');
    expect(typeof prescriptionsService.getById).toBe('function');
    expect(typeof prescriptionsService.create).toBe('function');
    expect(typeof prescriptionsService.delete).toBe('function');
  });

  it('devrait avoir les methodes specifiques prescriptions', () => {
    expect(typeof prescriptionsService.getByPatient).toBe('function');
    expect(typeof prescriptionsService.getByDoctor).toBe('function');
    expect(typeof prescriptionsService.getMedicines).toBe('function');
  });

  it('devrait etre un objet valide', () => {
    expect(prescriptionsService).toBeDefined();
  });
});
