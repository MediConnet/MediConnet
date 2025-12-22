import type { AmbulanceService } from '../domain/AmbulanceService.entity';
import type { Review } from '../domain/Review.entity';
import { ambulancesMock } from '../application/ambulances.mock';

/**
 * API: Obtener lista de servicios de ambulancias
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/ambulances
 */
export const getAmbulancesAPI = async (): Promise<AmbulanceService[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<AmbulanceService[]>('/ambulances');
  // return response.data;

  // NOTE: Datos mock por ahora
  return ambulancesMock;
};

/**
 * API: Obtener detalle de un servicio de ambulancia
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/ambulances/:id
 */
export const getAmbulanceAPI = async (id: string): Promise<AmbulanceService> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<AmbulanceService>(`/ambulances/${id}`);
  // return response.data;

  // NOTE: Datos mock por ahora
  const ambulance = ambulancesMock.find(amb => amb.id === id);
  if (!ambulance) {
    throw new Error('Servicio de ambulancia no encontrado');
  }
  return ambulance;
};

/**
 * API: Obtener reseñas de un servicio de ambulancia
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/ambulances/:id/reviews
 */
export const getAmbulanceReviewsAPI = async (ambulanceId: string): Promise<Review[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Review[]>(`/ambulances/${ambulanceId}/reviews`);
  // return response.data;

  // NOTE: Datos mock por ahora - almacenar en localStorage para persistencia
  const storedReviews = localStorage.getItem(`amb-reviews_${ambulanceId}`);
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

/**
 * API: Crear una reseña
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: POST /api/ambulances/:id/reviews
 */
export const createReviewAPI = async (params: { ambulanceId: string; rating: number; comment?: string }): Promise<Review> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post<Review>(`/ambulances/${params.ambulanceId}/reviews`, params);
  // return response.data;

  // NOTE: Datos mock por ahora - guardar en localStorage
  const existingReviews = await getAmbulanceReviewsAPI(params.ambulanceId);
  
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
    ambulanceId: params.ambulanceId,
    userId,
    userName,
    rating: params.rating,
    comment: params.comment,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...existingReviews, newReview];
  localStorage.setItem(`amb-reviews_${params.ambulanceId}`, JSON.stringify(updatedReviews));

  return newReview;
};


