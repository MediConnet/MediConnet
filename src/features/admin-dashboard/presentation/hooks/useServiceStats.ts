import { useEffect, useState } from "react";
import { getServiceStatsUseCase } from "../../application/get-service-stats.usecase";
import type { ServiceStats } from "../../domain/service-stats.entity";

export const useServiceStats = () => {
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getServiceStatsUseCase();
        setStats(data);
      } catch (err) {
        setError("Error al cargar las estadísticas.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};