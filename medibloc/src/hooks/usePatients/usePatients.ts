import { useCallback, useState } from 'react';
import { patientsService } from '../../services';
import type { CreatePatientDto, UpdatePatientDto, PaginationParams } from '../../types';

export function usePatients() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = useCallback(
    (params?: PaginationParams) => request(() => patientsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => patientsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreatePatientDto) => request(() => patientsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdatePatientDto) => request(() => patientsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => patientsService.delete(id)),
    [request]
  );

  const getDiseases = useCallback(
    (id: number) => request(() => patientsService.getDiseases(id)),
    [request]
  );

  const getAppointments = useCallback(
    (id: number) => request(() => patientsService.getAppointments(id)),
    [request]
  );

  const getPrescriptions = useCallback(
    (id: number) => request(() => patientsService.getPrescriptions(id)),
    [request]
  );

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
    getDiseases,
    getAppointments,
    getPrescriptions,
  };
}
