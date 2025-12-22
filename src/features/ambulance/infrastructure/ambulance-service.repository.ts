import type { AmbulanceService } from '../domain/AmbulanceService.entity';
import type { Review } from '../domain/Review.entity';
import { getAmbulancesAPI, getAmbulanceAPI, getAmbulanceReviewsAPI, createReviewAPI } from './ambulance-service.api';

/**
 * Repository pattern para Ambulance Services
 * Abstrae la lógica de acceso a datos
 */
export class AmbulanceRepository {
  async getAmbulances(): Promise<AmbulanceService[]> {
    return await getAmbulancesAPI();
  }

  async getAmbulance(id: string): Promise<AmbulanceService> {
    return await getAmbulanceAPI(id);
  }

  async getAmbulanceReviews(ambulanceId: string): Promise<Review[]> {
    return await getAmbulanceReviewsAPI(ambulanceId);
  }

  async createReview(params: { ambulanceId: string; rating: number; comment?: string }): Promise<Review> {
    return await createReviewAPI(params);
  }
}

