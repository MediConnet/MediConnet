import type { Laboratory } from '../domain/laboratory.model';
import type { Review } from '../domain/Review.entity';
import { laboratoriesMock } from '../application/laboratories.mock';

/**
 * API: Obtener lista de laboratorios
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/laboratories
 */
export const getLaboratoriesAPI = async (): Promise<Laboratory[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Laboratory[]>('/laboratories');
  // return response.data;

  // NOTE: Datos mock por ahora
  return laboratoriesMock;
};

/**
 * API: Obtener detalle de un laboratorio
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/laboratories/:id
 */
export const getLaboratoryAPI = async (id: string): Promise<Laboratory> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Laboratory>(`/laboratories/${id}`);
  // return response.data;

  // NOTE: Datos mock por ahora
  const laboratory = laboratoriesMock.find(lab => lab.id === id);
  if (!laboratory) {
    throw new Error('Laboratorio no encontrado');
  }
  return laboratory;
};

/**
 * API: Obtener reseñas de un laboratorio
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/laboratories/:id/reviews
 */
export const getLaboratoryReviewsAPI = async (laboratoryId: string): Promise<Review[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Review[]>(`/laboratories/${laboratoryId}/reviews`);
  // return response.data;

  // NOTE: Datos mock por ahora - almacenar en localStorage para persistencia
  const storedReviews = localStorage.getItem(`lab-reviews_${laboratoryId}`);
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

/**
 * API: Crear una reseña
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: POST /api/laboratories/:id/reviews
 */
export const createReviewAPI = async (params: { laboratoryId: string; rating: number; comment?: string }): Promise<Review> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post<Review>(`/laboratories/${params.laboratoryId}/reviews`, params);
  // return response.data;

  // NOTE: Datos mock por ahora - guardar en localStorage
  const existingReviews = await getLaboratoryReviewsAPI(params.laboratoryId);
  
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
    laboratoryId: params.laboratoryId,
    userId,
    userName,
    rating: params.rating,
    comment: params.comment,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...existingReviews, newReview];
  localStorage.setItem(`lab-reviews_${params.laboratoryId}`, JSON.stringify(updatedReviews));

  return newReview;
};

