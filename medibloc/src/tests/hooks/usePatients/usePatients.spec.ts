import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePatients } from '../../../hooks/usePatients/usePatients';

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => usePatients());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes CRUD', () => {
    const { result } = renderHook(() => usePatients());
    expect(typeof result.current.getAll).toBe('function');
    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
  });

  it('devrait avoir les methodes specifiques', () => {
    const { result } = renderHook(() => usePatients());
    expect(typeof result.current.getAppointments).toBe('function');
    expect(typeof result.current.getPrescriptions).toBe('function');
    expect(typeof result.current.getDiseases).toBe('function');
  });
});
