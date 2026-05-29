import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { Review } from '../domain/review.entity';

/**
 * API: Obtener reseñas de ambulancia
 * Endpoint: GET /api/ambulances/reviews
 */
export const getAmbulanceReviewsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<Review> }>(
    '/ambulances/reviews',
    { params }
  );
  return extractData(response);
};
