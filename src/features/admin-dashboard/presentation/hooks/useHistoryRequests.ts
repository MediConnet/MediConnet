import { useQuery } from "@tanstack/react-query";
import { getHistoryUseCase } from "../../application/get-history.usecase";

/**
 * Hook: Obtener historial de solicitudes (aprobadas y rechazadas)
 * Usa GET /api/admin/history para mejor rendimiento
 */
export const useHistoryRequests = () => {
  return useQuery({
    queryKey: ['provider-history-list'],
    queryFn: getHistoryUseCase,
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });
};
