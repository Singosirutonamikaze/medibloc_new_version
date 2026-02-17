import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStats } from '../../../hooks/useStats/useStats';

describe('useStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => useStats());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes de recuperation', () => {
    const { result } = renderHook(() => useStats());
    expect(typeof result.current.getDashboardStats).toBe('function');
    expect(typeof result.current.getAppointmentsStats).toBe('function');
    expect(typeof result.current.getPatientsStats).toBe('function');
    expect(typeof result.current.getDiseasesStats).toBe('function');
  });

  it('devrait gerer le chargement et les erreurs', () => {
    const { result } = renderHook(() => useStats());
    expect(typeof result.current.loading).toBe('boolean');
    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
  });
});
