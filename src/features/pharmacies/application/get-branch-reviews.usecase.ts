import type { Review } from '../domain/Review.entity';
import { PharmacyRepository } from '../infrastructure/pharmacy.repository';

const pharmacyRepository = new PharmacyRepository();

/**
 * Caso de uso: Obtener reseñas de una sucursal
 */
export const getBranchReviewsUseCase = async (branchId: string): Promise<Review[]> => {
  return await pharmacyRepository.getBranchReviews(branchId);
};

