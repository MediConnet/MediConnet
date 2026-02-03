import { httpClient, extractData } from '../../../shared/lib/http';
import type { Review } from '../domain/review.entity';

/**
 * API: Obtener reseñas de ambulancia
 * Endpoint: GET /api/ambulances/reviews
 */
export const getAmbulanceReviewsAPI = async (): Promise<Review[]> => {
  const response = await httpClient.get<{ success: boolean; data: Review[] }>(
    '/ambulances/reviews'
  );
  return extractData(response);
};
