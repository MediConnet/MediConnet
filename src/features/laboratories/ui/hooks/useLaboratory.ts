import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLaboratoriesUseCase } from '../../application/get-laboratories.usecase';
import { getLaboratoryUseCase } from '../../application/get-laboratory.usecase';
import { getLaboratoryReviewsUseCase } from '../../application/get-laboratory-reviews.usecase';
import { createReviewUseCase, type CreateReviewParams } from '../../application/create-review.usecase';
import type { Laboratory } from '../../domain/laboratory.model';
import type { Review } from '../../domain/Review.entity';

/**
 * Hook: Obtener lista de laboratorios
 */
export const useLaboratories = () => {
  return useQuery<Laboratory[]>({
    queryKey: ['laboratories'],
    queryFn: () => getLaboratoriesUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener detalle de un laboratorio
 */
export const useLaboratory = (id: string) => {
  return useQuery<Laboratory>({
    queryKey: ['laboratory', id],
    queryFn: () => getLaboratoryUseCase(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener reseñas de un laboratorio
 */
export const useLaboratoryReviews = (laboratoryId: string) => {
  return useQuery<Review[]>({
    queryKey: ['laboratory-reviews', laboratoryId],
    queryFn: () => getLaboratoryReviewsUseCase(laboratoryId),
    enabled: !!laboratoryId,
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
      // Invalidar y refrescar las reseñas después de crear una nueva
      queryClient.invalidateQueries({ queryKey: ['laboratory-reviews', variables.laboratoryId] });
      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['laboratory-reviews', variables.laboratoryId] });
    },
    onError: (error) => {
      console.error('Error en useCreateReview:', error);
    },
  });
};

