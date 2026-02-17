import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrescriptions } from '../../../hooks/usePrescriptions/usePrescriptions';

describe('usePrescriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner les proprietes initiales', () => {
    const { result } = renderHook(() => usePrescriptions());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('devrait avoir les methodes CRUD', () => {
    const { result } = renderHook(() => usePrescriptions());
    expect(typeof result.current.getAll).toBe('function');
    expect(typeof result.current.getById).toBe('function');
    expect(typeof result.current.create).toBe('function');
  });

  it('devrait avoir les methodes specifiques', () => {
    const { result } = renderHook(() => usePrescriptions());
    expect(typeof result.current.getByPatient).toBe('function');
    expect(typeof result.current.getByDoctor).toBe('function');
    expect(typeof result.current.getMedicines).toBe('function');
  });
});
