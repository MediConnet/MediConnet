import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import {
  getConsultationPricesAPI,
  createConsultationPriceAPI,
  updateConsultationPriceAPI,
  deleteConsultationPriceAPI,
} from "../../infrastructure/consultation-prices.api";
import type { ConsultationPrice, CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../../domain/ConsultationPrice.entity";

export const useConsultationPrices = () => {
  const [consultationPrices, setConsultationPrices] = useState<ConsultationPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const feedback = useFeedbackStore();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getConsultationPricesAPI({ page, limit });
      setConsultationPrices(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err?.message || "Error al cargar precios de consulta");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createMutation = useMutation({
    mutationFn: createConsultationPriceAPI,
    onSuccess: () => {
      feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
      loadData();
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsultationPriceRequest }) =>
      updateConsultationPriceAPI(id, data),
    onSuccess: () => {
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
      loadData();
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConsultationPriceAPI,
    onSuccess: () => {
      feedback.showFeedback('success', 'Registro eliminado', 'La acción se completó correctamente.');
      loadData();
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });

  return {
    consultationPrices,
    loading,
    error,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
    createConsultationPrice: createMutation.mutateAsync,
    updateConsultationPrice: updateMutation.mutateAsync,
    deleteConsultationPrice: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
