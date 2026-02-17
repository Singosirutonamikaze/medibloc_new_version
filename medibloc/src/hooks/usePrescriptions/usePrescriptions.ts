import { useCallback, useState } from 'react';
import { prescriptionsService } from '../../services';
import type { CreatePrescriptionDto, UpdatePrescriptionDto, PaginationParams } from '../../types';

export function usePrescriptions() {
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
    (params?: PaginationParams) => request(() => prescriptionsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => prescriptionsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreatePrescriptionDto) => request(() => prescriptionsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdatePrescriptionDto) => request(() => prescriptionsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => prescriptionsService.delete(id)),
    [request]
  );

  const getByPatient = useCallback(
    (patientId: number) => request(() => prescriptionsService.getByPatient(patientId)),
    [request]
  );

  const getByDoctor = useCallback(
    (doctorId: number) => request(() => prescriptionsService.getByDoctor(doctorId)),
    [request]
  );

  const getMedicines = useCallback(
    (id: number) => request(() => prescriptionsService.getMedicines(id)),
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
    getByPatient,
    getByDoctor,
    getMedicines,
  };
}
