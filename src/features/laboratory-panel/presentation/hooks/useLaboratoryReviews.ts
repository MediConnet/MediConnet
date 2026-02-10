import { useQuery } from '@tanstack/react-query';
import { getLaboratoryPanelReviewsAPI } from '../../infrastructure/laboratories.repository';
import type { LaboratoryReview } from '../../domain/LaboratoryReview.entity';

interface LaboratoryReviewsResponse {
  reviews: LaboratoryReview[];
  averageRating: number;
  totalReviews: number;
}

/**
 * Hook: Obtener reseñas del panel de laboratorio (proveedor autenticado)
 * Usa el endpoint: GET /api/laboratories/reviews
 */
export const useLaboratoryReviews = () => {
  return useQuery<LaboratoryReviewsResponse>({
    queryKey: ['laboratory-panel-reviews'],
    queryFn: () => getLaboratoryPanelReviewsAPI(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  });
};
