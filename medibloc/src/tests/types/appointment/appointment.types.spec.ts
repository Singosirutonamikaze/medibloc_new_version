import { describe, it, expect } from 'vitest';
import type { Appointment, CreateAppointmentDto } from '../../../types/appointment/appointment.types';

describe('Appointment Types', () => {
  it('devrait valider le type Appointment', () => {
    const appointment: Appointment = {
      id: 1,
      patientId: 1,
      doctorId: 1,
      scheduledAt: '2024-01-20T10:30:00Z',
      reason: 'Regular checkup',
      status: 'PENDING',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    expect(appointment.id).toBe(1);
  });

  it('devrait valider CreateAppointmentDto', () => {
    const createDto: CreateAppointmentDto = {
      patientId: 1,
      doctorId: 1,
      scheduledAt: '2024-01-20T10:30:00Z',
      reason: 'Follow-up visit',
    };

    expect(createDto.patientId).toBe(1);
    expect(createDto.doctorId).toBe(1);
  });
});

