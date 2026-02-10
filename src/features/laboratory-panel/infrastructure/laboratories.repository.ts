import { httpClient, extractData } from '../../../shared/lib/http';
import type { LaboratoryDashboard } from "../domain/LaboratoryDashboard.entity";
import type { LaboratoryReview } from "../domain/LaboratoryReview.entity";

/**
 * API: Obtener dashboard de laboratorio
 * Endpoint: GET /api/laboratories/:userId/dashboard
 */
export const getLaboratoryDashboardAPI = async (userId: string): Promise<LaboratoryDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryDashboard }>(
    `/laboratories/${userId}/dashboard`
  );
  return extractData(response);
};

/**
 * API: Obtener reseñas del panel de laboratorio (proveedor autenticado)
 * Endpoint: GET /api/laboratories/reviews
 * Requiere: Bearer token
 */
export const getLaboratoryPanelReviewsAPI = async (): Promise<{
  reviews: LaboratoryReview[];
  averageRating: number;
  totalReviews: number;
}> => {
  const response = await httpClient.get<{
    success: boolean;
    data: {
      reviews: LaboratoryReview[];
      averageRating: number;
      totalReviews: number;
    };
  }>('/laboratories/reviews');
  return extractData(response);
};
