import { useQuery } from "@tanstack/react-query";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { getLaboratoryDashboardUseCase } from "../../application/get-laboratory-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

/**
 * Hook: Obtener dashboard del laboratorio
 * Migrado a React Query
 */
export const useLaboratoryDashboard = () => {
  const { user } = useAuthStore();

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<LaboratoryDashboard>({
    queryKey: ['laboratories', 'dashboard', user?.id],
    queryFn: () => getLaboratoryDashboardUseCase(user!.id),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  return { data: data || null, loading, error, refetch, setData: () => {} };
};
