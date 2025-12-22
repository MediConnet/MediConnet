import type { Review } from '../domain/Review.entity';
import { AmbulanceRepository } from '../infrastructure/ambulance-service.repository';

const ambulanceRepository = new AmbulanceRepository();

/**
 * Caso de uso: Obtener reseñas de un servicio de ambulancia
 */
export const getAmbulanceReviewsUseCase = async (ambulanceId: string): Promise<Review[]> => {
  return await ambulanceRepository.getAmbulanceReviews(ambulanceId);
};

