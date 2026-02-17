import { useCallback, useState } from 'react';
import { appointmentsService } from '../../services';
import type { CreateAppointmentDto, UpdateAppointmentDto, PaginationParams, AppointmentStatus } from '../../types';

export function useAppointments() {
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
    (params?: PaginationParams & { status?: AppointmentStatus }) =>
      request(() => appointmentsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => appointmentsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateAppointmentDto) => request(() => appointmentsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateAppointmentDto) => request(() => appointmentsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => appointmentsService.delete(id)),
    [request]
  );

  const updateStatus = useCallback(
    (id: number, status: AppointmentStatus) => request(() => appointmentsService.updateStatus(id, status)),
    [request]
  );

  const getByPatient = useCallback(
    (patientId: number) => request(() => appointmentsService.getByPatient(patientId)),
    [request]
  );

  const getByDoctor = useCallback(
    (doctorId: number) => request(() => appointmentsService.getByDoctor(doctorId)),
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
    updateStatus,
    getByPatient,
    getByDoctor,
  };
}
