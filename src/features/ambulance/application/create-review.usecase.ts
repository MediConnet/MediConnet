import type { Review } from '../domain/Review.entity';
import { AmbulanceRepository } from '../infrastructure/ambulance-service.repository';

const ambulanceRepository = new AmbulanceRepository();

export interface CreateReviewParams {
  ambulanceId: string;
  rating: number;
  comment?: string;
}

/**
 * Caso de uso: Crear una reseña
 */
export const createReviewUseCase = async (params: CreateReviewParams): Promise<Review> => {
  return await ambulanceRepository.createReview(params);
};

