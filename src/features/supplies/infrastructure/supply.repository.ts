import type { SupplyStore } from '../domain/SupplyStore.entity';
import type { Review } from '../domain/Review.entity';
import { getSuppliesAPI, getSupplyAPI, getSupplyReviewsAPI, createReviewAPI } from './supply.api';

/**
 * Repository pattern para Supply Stores
 * Abstrae la lógica de acceso a datos
 */
export class SupplyRepository {
  async getSupplies(): Promise<SupplyStore[]> {
    return await getSuppliesAPI();
  }

  async getSupply(id: string): Promise<SupplyStore> {
    return await getSupplyAPI(id);
  }

  async getSupplyReviews(supplyStoreId: string): Promise<Review[]> {
    return await getSupplyReviewsAPI(supplyStoreId);
  }

  async createReview(params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> {
    return await createReviewAPI(params);
  }
}

