import type { Review } from '../domain/Review.entity';
import { SupplyRepository } from '../infrastructure/supply.repository';

const supplyRepository = new SupplyRepository();

export interface CreateReviewParams {
  supplyStoreId: string;
  rating: number;
  comment?: string;
}

/**
 * Caso de uso: Crear una reseña
 */
export const createReviewUseCase = async (params: CreateReviewParams): Promise<Review> => {
  return await supplyRepository.createReview(params);
};

