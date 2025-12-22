import type { Review } from '../domain/Review.entity';
import { SupplyRepository } from '../infrastructure/supply.repository';

const supplyRepository = new SupplyRepository();

/**
 * Caso de uso: Obtener reseñas de una tienda de insumos
 */
export const getSupplyReviewsUseCase = async (supplyStoreId: string): Promise<Review[]> => {
  return await supplyRepository.getSupplyReviews(supplyStoreId);
};

