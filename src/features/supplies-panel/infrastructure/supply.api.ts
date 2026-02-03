import { httpClient, extractData } from '../../../shared/lib/http';
import type { SupplyStore } from '../domain/SupplyStore.entity';
import type { Review } from '../domain/Review.entity';

/**
 * API: Obtener lista de tiendas de insumos
 * Endpoint: GET /api/supplies
 */
export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore[] }>(
    '/supplies'
  );
  return extractData(response);
};

/**
 * API: Obtener detalle de una tienda de insumos
 * Endpoint: GET /api/supplies/:id
 */
export const getSupplyAPI = async (id: string): Promise<SupplyStore> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore }>(
    `/supplies/${id}`
  );
  return extractData(response);
};

/**
 * API: Obtener reseñas de una tienda de insumos
 * Endpoint: GET /api/supplies/:id/reviews
 */
export const getSupplyReviewsAPI = async (supplyStoreId: string): Promise<Review[]> => {
  const response = await httpClient.get<{ success: boolean; data: Review[] }>(
    `/supplies/${supplyStoreId}/reviews`
  );
  return extractData(response);
};

/**
 * API: Crear una reseña
 * Endpoint: POST /api/supplies/:id/reviews
 */
export const createReviewAPI = async (params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> => {
  const response = await httpClient.post<{ success: boolean; data: Review }>(
    `/supplies/${params.supplyStoreId}/reviews`,
    { rating: params.rating, comment: params.comment }
  );
  return extractData(response);
};
