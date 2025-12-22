import type { Laboratory } from '../domain/laboratory.model';
import type { Review } from '../domain/Review.entity';
import { getLaboratoriesAPI, getLaboratoryAPI, createReviewAPI, getLaboratoryReviewsAPI } from './laboratory.api';

/**
 * Repository pattern para Laboratories
 * Abstrae la lógica de acceso a datos
 */
export class LaboratoryRepository {
  async getLaboratories(): Promise<Laboratory[]> {
    return await getLaboratoriesAPI();
  }

  async getLaboratory(id: string): Promise<Laboratory> {
    return await getLaboratoryAPI(id);
  }

  async getLaboratoryReviews(laboratoryId: string): Promise<Review[]> {
    return await getLaboratoryReviewsAPI(laboratoryId);
  }

  async createReview(params: { laboratoryId: string; rating: number; comment?: string }): Promise<Review> {
    return await createReviewAPI(params);
  }
}

