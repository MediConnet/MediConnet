import type { PharmacyReview } from "../domain/pharmacy-review.entity";
import { getPharmacyReviewsMock } from "../infrastructure/pharmacy-reviews.mock";

export const getPharmacyReviewsUseCase = async (): Promise<PharmacyReview[]> => {
  return await getPharmacyReviewsMock();
};