import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { SupplyStore } from '../domain/SupplyStore.entity';
import type { Review } from '../domain/Review.entity';
import { getSuppliesAPI, getSupplyAPI, getSupplyReviewsAPI, createReviewAPI } from './supply.api';

export class SupplyRepository {
  async getSupplies(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<SupplyStore>> {
    return await getSuppliesAPI(params);
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

