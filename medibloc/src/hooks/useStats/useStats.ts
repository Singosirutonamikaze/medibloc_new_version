import { useCallback, useState } from 'react';
import { statsService } from '../../services';

export function useStats() {
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

  const getDashboardStats = useCallback(
    () => request(() => statsService.getDashboardStats()),
    [request]
  );

  const getAppointmentsStats = useCallback(
    (params?: { startDate?: string; endDate?: string }) =>
      request(() => statsService.getAppointmentsStats(params)),
    [request]
  );

  const getPatientsStats = useCallback(
    () => request(() => statsService.getPatientsStats()),
    [request]
  );

  const getDiseasesStats = useCallback(
    () => request(() => statsService.getDiseasesStats()),
    [request]
  );

  return {
    loading,
    error,
    getDashboardStats,
    getAppointmentsStats,
    getPatientsStats,
    getDiseasesStats,
  };
}
