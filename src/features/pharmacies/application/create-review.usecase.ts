import type { Review } from '../domain/Review.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

export interface CreateReviewParams {
  branchId: string;
  rating: number;
  comment?: string;
}

/**
 * Caso de uso: Crear una reseña
 */
export const createReviewUseCase = async (params: CreateReviewParams): Promise<Review> => {
  return await pharmacyRepository.createReview(params);
};

