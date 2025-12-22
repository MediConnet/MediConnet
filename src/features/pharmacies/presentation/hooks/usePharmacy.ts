import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPharmaciesUseCase } from '../../application/get-pharmacies.usecase';
import { getPharmacyUseCase } from '../../application/get-pharmacy.usecase';
import { getPharmacyBranchesUseCase } from '../../application/get-pharmacy-branches.usecase';
import { getBranchUseCase } from '../../application/get-branch.usecase';
import { getBranchReviewsUseCase } from '../../application/get-branch-reviews.usecase';
import { createReviewUseCase, type CreateReviewParams } from '../../application/create-review.usecase';
import type { Pharmacy } from '../../domain/Pharmacy.entity';
import type { PharmacyBranch } from '../../domain/PharmacyBranch.entity';
import type { Review } from '../../domain/Review.entity';

/**
 * Hook: Obtener lista de farmacias
 */
export const usePharmacies = () => {
  return useQuery<Pharmacy[]>({
    queryKey: ['pharmacies'],
    queryFn: () => getPharmaciesUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Obtener detalle de una farmacia
 */
export const usePharmacy = (id: string) => {
  return useQuery<Pharmacy>({
    queryKey: ['pharmacy', id],
    queryFn: () => getPharmacyUseCase(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Obtener sucursales de una farmacia
 */
export const usePharmacyBranches = (pharmacyId: string) => {
  return useQuery<PharmacyBranch[]>({
    queryKey: ['pharmacy-branches', pharmacyId],
    queryFn: () => getPharmacyBranchesUseCase(pharmacyId),
    enabled: !!pharmacyId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Obtener detalle de una sucursal
 */
export const useBranch = (branchId: string) => {
  return useQuery<PharmacyBranch>({
    queryKey: ['branch', branchId],
    queryFn: () => getBranchUseCase(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Obtener reseñas de una sucursal
 */
export const useBranchReviews = (branchId: string) => {
  return useQuery<Review[]>({
    queryKey: ['branch-reviews', branchId],
    queryFn: () => getBranchReviewsUseCase(branchId),
    enabled: !!branchId,
    staleTime: 2 * 60 * 1000, // 2 minutos (cambian más frecuentemente)
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
      queryClient.invalidateQueries({ queryKey: ['branch-reviews', variables.branchId] });
      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['branch-reviews', variables.branchId] });
    },
    onError: (error) => {
      console.error('Error en useCreateReview:', error);
    },
  });
};

