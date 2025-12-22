import type { SupplyStore } from '../domain/SupplyStore.entity';
import type { Review } from '../domain/Review.entity';
import { suppliesMock } from '../application/supplies.mock';

/**
 * API: Obtener lista de tiendas de insumos
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/supplies
 */
export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<SupplyStore[]>('/supplies');
  // return response.data;

  // NOTE: Datos mock por ahora
  return suppliesMock;
};

/**
 * API: Obtener detalle de una tienda de insumos
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/supplies/:id
 */
export const getSupplyAPI = async (id: string): Promise<SupplyStore> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<SupplyStore>(`/supplies/${id}`);
  // return response.data;

  // NOTE: Datos mock por ahora
  const supply = suppliesMock.find(s => s.id === id);
  if (!supply) {
    throw new Error('Tienda de insumos no encontrada');
  }
  return supply;
};

/**
 * API: Obtener reseñas de una tienda de insumos
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/supplies/:id/reviews
 */
export const getSupplyReviewsAPI = async (supplyStoreId: string): Promise<Review[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Review[]>(`/supplies/${supplyStoreId}/reviews`);
  // return response.data;

  // NOTE: Datos mock por ahora - almacenar en localStorage para persistencia
  const storedReviews = localStorage.getItem(`supply-reviews_${supplyStoreId}`);
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

/**
 * API: Crear una reseña
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: POST /api/supplies/:id/reviews
 */
export const createReviewAPI = async (params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post<Review>(`/supplies/${params.supplyStoreId}/reviews`, params);
  // return response.data;

  // NOTE: Datos mock por ahora - guardar en localStorage
  const existingReviews = await getSupplyReviewsAPI(params.supplyStoreId);
  
  // Obtener usuario desde localStorage
  const savedUser = localStorage.getItem('auth-user');
  let userId = 'user_1';
  let userName = 'Usuario';
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      userId = user.id || userId;
      userName = user.name || userName;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
    }
  }
  
  const newReview: Review = {
    id: `review_${Date.now()}`,
    supplyStoreId: params.supplyStoreId,
    userId,
    userName,
    rating: params.rating,
    comment: params.comment,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...existingReviews, newReview];
  localStorage.setItem(`supply-reviews_${params.supplyStoreId}`, JSON.stringify(updatedReviews));

  return newReview;
};

