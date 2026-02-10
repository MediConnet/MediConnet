import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliesUseCase } from '../../application/get-supplies.usecase';
import { getSupplyUseCase } from '../../application/get-supply.usecase';
import { getSupplyReviewsUseCase } from '../../application/get-supply-reviews.usecase';
import { createReviewUseCase, type CreateReviewParams } from '../../application/create-review.usecase';
import { getSupplyPanelReviewsAPI } from '../../infrastructure/supply.api';
import type { SupplyStore } from '../../domain/SupplyStore.entity';
import type { Review } from '../../domain/Review.entity';

interface SupplyPanelReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

/**
 * Hook: Obtener lista de tiendas de insumos
 */
export const useSupplies = () => {
  return useQuery<SupplyStore[]>({
    queryKey: ['supplies'],
    queryFn: () => getSuppliesUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
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

/**
 * Hook: Obtener reseñas del panel de insumos (proveedor autenticado)
 * Usa el endpoint: GET /api/supplies/reviews
 */
export const useSupplyPanelReviews = () => {
  return useQuery<SupplyPanelReviewsResponse>({
    queryKey: ['supply-panel-reviews'],
    queryFn: () => getSupplyPanelReviewsAPI(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  });
};

/**
 * Hook: Crear una reseña
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReviewParams) => createReviewUseCase(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supply-reviews', variables.supplyStoreId] });
      queryClient.refetchQueries({ queryKey: ['supply-reviews', variables.supplyStoreId] });
    },
    onError: (error) => {
      console.error('Error en useCreateReview:', error);
    },
  });
};

