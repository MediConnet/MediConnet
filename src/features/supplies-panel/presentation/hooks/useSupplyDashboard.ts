import { useQuery } from "@tanstack/react-query";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";
import { getSupplyDashboardUseCase } from "../../application/get-supply-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

/**
 * Hook: Obtener dashboard de insumos médicos
 * Migrado a React Query
 */
export const useSupplyDashboard = () => {
  const { user } = useAuthStore();

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<SupplyDashboard>({
    queryKey: ['supplies', 'dashboard', user?.id],
    queryFn: () => getSupplyDashboardUseCase(user!.id),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  return { data: data || null, loading, error, refetch, setData: () => {} };
};

