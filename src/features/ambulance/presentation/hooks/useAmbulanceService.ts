import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAmbulancesUseCase } from '../../application/get-ambulances.usecase';
import { getAmbulanceUseCase } from '../../application/get-ambulance.usecase';
import { getAmbulanceReviewsUseCase } from '../../application/get-ambulance-reviews.usecase';
import { createReviewUseCase, type CreateReviewParams } from '../../application/create-review.usecase';
import type { AmbulanceService } from '../../domain/AmbulanceService.entity';
import type { Review } from '../../domain/Review.entity';

/**
 * Hook: Obtener lista de servicios de ambulancias
 */
export const useAmbulances = () => {
  return useQuery<AmbulanceService[]>({
    queryKey: ['ambulances'],
    queryFn: () => getAmbulancesUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener detalle de un servicio de ambulancia
 */
export const useAmbulance = (id: string) => {
  return useQuery<AmbulanceService>({
    queryKey: ['ambulance', id],
    queryFn: () => getAmbulanceUseCase(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener reseñas de un servicio de ambulancia
 */
export const useAmbulanceReviews = (ambulanceId: string) => {
  return useQuery<Review[]>({
    queryKey: ['ambulance-reviews', ambulanceId],
    queryFn: () => getAmbulanceReviewsUseCase(ambulanceId),
    enabled: !!ambulanceId,
    staleTime: 2 * 60 * 1000, // 2 minutos
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
      queryClient.invalidateQueries({ queryKey: ['ambulance-reviews', variables.ambulanceId] });
      queryClient.refetchQueries({ queryKey: ['ambulance-reviews', variables.ambulanceId] });
    },
    onError: (error) => {
      console.error('Error en useCreateReview:', error);
    },
  });
};


