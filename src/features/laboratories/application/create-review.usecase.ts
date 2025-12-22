import type { Review } from '../domain/Review.entity';
import { LaboratoryRepository } from '../infrastructure/laboratory.repository';

const laboratoryRepository = new LaboratoryRepository();

export interface CreateReviewParams {
  laboratoryId: string;
  rating: number;
  comment?: string;
}

/**
 * Caso de uso: Crear una reseña
 */
export const createReviewUseCase = async (params: CreateReviewParams): Promise<Review> => {
  return await laboratoryRepository.createReview(params);
};

