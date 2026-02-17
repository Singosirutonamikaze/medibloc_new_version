import { useCallback, useState } from 'react';
import { medicalRecordsService } from '../../services';
import type { CreateMedicalRecordDto, UpdateMedicalRecordDto, PaginationParams } from '../../types';

export function useMedicalRecords() {
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
    (params?: PaginationParams) => request(() => medicalRecordsService.getAll(params)),
    [request]
  );

  const getById = useCallback(
    (id: number) => request(() => medicalRecordsService.getById(id)),
    [request]
  );

  const create = useCallback(
    (data: CreateMedicalRecordDto) => request(() => medicalRecordsService.create(data)),
    [request]
  );

  const update = useCallback(
    (id: number, data: UpdateMedicalRecordDto) => request(() => medicalRecordsService.update(id, data)),
    [request]
  );

  const remove = useCallback(
    (id: number) => request(() => medicalRecordsService.delete(id)),
    [request]
  );

  const getByPatient = useCallback(
    (patientId: number) => request(() => medicalRecordsService.getByPatient(patientId)),
    [request]
  );

  const getByDoctor = useCallback(
    (doctorId: number) => request(() => medicalRecordsService.getByDoctor(doctorId)),
    [request]
  );

  const getByAppointment = useCallback(
    (appointmentId: number) => request(() => medicalRecordsService.getByAppointment(appointmentId)),
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
    getByAppointment,
  };
}
