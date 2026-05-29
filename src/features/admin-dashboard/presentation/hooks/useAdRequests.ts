import { useQuery } from "@tanstack/react-query";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";

export const useAdRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  // ✅ CORRECCIÓN: No usar valor por defecto 'PENDING' en queryKey
  // Esto causaba que siempre se filtrara por pendientes
  const statusKey = params?.status || 'all';
  const pageKey = params?.page || 1;
  const limitKey = params?.limit || 20;
  
  return useQuery({
    queryKey: ['ad-requests-list', statusKey, pageKey, limitKey],
    queryFn: () => getAdRequestsUseCase(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

