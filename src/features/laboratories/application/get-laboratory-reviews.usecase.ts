import type { Review } from '../domain/Review.entity';
import { LaboratoryRepository } from '../infrastructure/laboratory.repository';

const laboratoryRepository = new LaboratoryRepository();

/**
 * Caso de uso: Obtener reseñas de un laboratorio
 */
export const getLaboratoryReviewsUseCase = async (laboratoryId: string): Promise<Review[]> => {
  return await laboratoryRepository.getLaboratoryReviews(laboratoryId);
};

