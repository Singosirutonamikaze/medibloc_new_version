import { describe, it, expect } from 'vitest';
import type { Role } from '../../../types/common/common.types';

describe('Common Types', () => {
  it('devrait definir les roles valides', () => {
    const roles: Role[] = ['PATIENT', 'DOCTOR', 'ADMIN'];

    expect(roles).toContain('PATIENT');
    expect(roles).toContain('DOCTOR');
    expect(roles).toContain('ADMIN');
    expect(roles.length).toBe(3);
  });

  it('devrait valider un rôle utilisateur', () => {
    const userRole: Role = 'PATIENT';
    expect(['PATIENT', 'DOCTOR', 'ADMIN']).toContain(userRole);
  });

  it('devrait valider un rôle docteur', () => {
    const doctorRole: Role = 'DOCTOR';
    expect(['PATIENT', 'DOCTOR', 'ADMIN']).toContain(doctorRole);
  });

  it('devrait valider un rôle administrateur', () => {
    const adminRole: Role = 'ADMIN';
    expect(['PATIENT', 'DOCTOR', 'ADMIN']).toContain(adminRole);
  });
});
