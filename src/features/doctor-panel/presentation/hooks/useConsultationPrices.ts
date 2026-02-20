import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConsultationPricesAPI,
  updateConsultationPricesAPI,
} from "../../infrastructure/consultation-prices.api";

/**
 * Hook para gestionar los precios de consulta por especialidad
 */
export const useConsultationPrices = () => {
  const queryClient = useQueryClient();

  // Query para obtener precios
  const {
    data: prices = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["consultation-prices"],
    queryFn: getConsultationPricesAPI,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para actualizar precios
  const updateMutation = useMutation({
    mutationFn: updateConsultationPricesAPI,
    onSuccess: () => {
      // Invalidar cache para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["consultation-prices"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });
    },
  });

  return {
    prices,
    isLoading,
    error,
    refetch,
    updatePrices: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
