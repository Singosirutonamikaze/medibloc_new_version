import { useCallback, useState } from 'react';
import { doctorsService } from '../../services';
import type { CreateDoctorDto, UpdateDoctorDto, PaginationParams } from '../../types';

export function useDoctors() {
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
    (params?: PaginationParams & { specialty?: string }) => request(() => doctorsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => doctorsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateDoctorDto) => request(() => doctorsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateDoctorDto) => request(() => doctorsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => doctorsService.delete(id)),
    [request]
  );

  const getAppointments = useCallback(
    (id: number) => request(() => doctorsService.getAppointments(id)),
    [request]
  );

  const getPrescriptions = useCallback(
    (id: number) => request(() => doctorsService.getPrescriptions(id)),
    [request]
  );

  const getSpecialties = useCallback(
    () => request(() => doctorsService.getSpecialties()),
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
    getAppointments,
    getPrescriptions,
    getSpecialties,
  };
}
