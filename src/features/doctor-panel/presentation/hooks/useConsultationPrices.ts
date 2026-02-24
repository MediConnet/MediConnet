import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConsultationPricesAPI,
  createConsultationPriceAPI,
  updateConsultationPriceAPI,
  deleteConsultationPriceAPI,
} from "../../infrastructure/consultation-prices.api";
import type { CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../../domain/ConsultationPrice.entity";

/**
 * Hook para gestionar los tipos de consulta por especialidad
 */
export const useConsultationPrices = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los tipos de consulta
  const {
    data: consultationPrices = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["consultation-prices"],
    queryFn: getConsultationPricesAPI,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para crear tipo de consulta
  const createMutation = useMutation({
    mutationFn: createConsultationPriceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-prices"] });
    },
  });

  // Mutation para actualizar tipo de consulta
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsultationPriceRequest }) =>
      updateConsultationPriceAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-prices"] });
    },
  });

  // Mutation para eliminar tipo de consulta
  const deleteMutation = useMutation({
    mutationFn: deleteConsultationPriceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-prices"] });
    },
  });

  return {
    consultationPrices,
    isLoading,
    error,
    refetch,
    createConsultationPrice: createMutation.mutateAsync,
    updateConsultationPrice: updateMutation.mutateAsync,
    deleteConsultationPrice: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
