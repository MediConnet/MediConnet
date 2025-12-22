import type { Pharmacy } from '../domain/Pharmacy.entity';
import type { PharmacyBranch } from '../domain/PharmacyBranch.entity';
import type { Review } from '../domain/Review.entity';
import {
  getPharmaciesAPI,
  getPharmacyAPI,
  getPharmacyBranchesAPI,
  getBranchAPI,
  getBranchReviewsAPI,
  createReviewAPI,
} from './pharmacy.api';

/**
 * Repository pattern para Pharmacies
 * Abstrae la lógica de acceso a datos
 */
export class PharmacyRepository {
  async getPharmacies(): Promise<Pharmacy[]> {
    return await getPharmaciesAPI();
  }

  async getPharmacy(id: string): Promise<Pharmacy> {
    return await getPharmacyAPI(id);
  }

  async getPharmacyBranches(pharmacyId: string): Promise<PharmacyBranch[]> {
    return await getPharmacyBranchesAPI(pharmacyId);
  }

  async getBranch(branchId: string): Promise<PharmacyBranch> {
    return await getBranchAPI(branchId);
  }

  async getBranchReviews(branchId: string): Promise<Review[]> {
    return await getBranchReviewsAPI(branchId);
  }

  async createReview(params: { branchId: string; rating: number; comment?: string }): Promise<Review> {
    return await createReviewAPI(params);
  }
}

