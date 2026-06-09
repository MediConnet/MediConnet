import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFeedbackStore } from '../../../../app/store/feedback.store';
import { getSuppliesUseCase } from '../../application/get-supplies.usecase';
import { getSupplyUseCase } from '../../application/get-supply.usecase';
import { getSupplyReviewsUseCase } from '../../application/get-supply-reviews.usecase';
import { createReviewUseCase, type CreateReviewParams } from '../../application/create-review.usecase';
import { getSupplyPanelReviewsAPI } from '../../infrastructure/supply.api';
import type { SupplyStore } from '../../domain/SupplyStore.entity';
import type { Review } from '../../domain/Review.entity';

export const useSupplies = () => {
  const [supplies, setSupplies] = useState<SupplyStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSuppliesUseCase({ page, limit });
      setSupplies(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error('Error cargando tiendas de insumos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { supplies, loading, total, page, setPage, limit, setLimit, refetch: loadData };
};

/**
 * Hook: Obtener detalle de una tienda de insumos
 */
export const useSupply = (id: string) => {
  return useQuery<SupplyStore>({
    queryKey: ['supply', id],
    queryFn: () => getSupplyUseCase(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener reseñas de una tienda de insumos (vista pública)
 */
export const useSupplyReviews = (supplyStoreId: string) => {
  return useQuery<Review[]>({
    queryKey: ['supply-reviews', supplyStoreId],
    queryFn: () => getSupplyReviewsUseCase(supplyStoreId),
    enabled: !!supplyStoreId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useSupplyPanelReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSupplyPanelReviewsAPI({ page, limit });
      setReviews(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error('Error cargando reseñas del panel:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { reviews, loading, total, page, setPage, limit, setLimit, refetch: loadData };
};

/**
 * Hook: Crear una reseña
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const feedback = useFeedbackStore();

  return useMutation({
    mutationFn: (params: CreateReviewParams) => createReviewUseCase(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supply-reviews', variables.supplyStoreId] });
      queryClient.refetchQueries({ queryKey: ['supply-reviews', variables.supplyStoreId] });
      feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });
};
