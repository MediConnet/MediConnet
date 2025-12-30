import type { Review } from "../domain/review.entity";
import { getAmbulanceReviewsMock } from "../infrastructure/reviews.mock";

export const getAmbulanceReviewsUseCase = async (): Promise<Review[]> => {
  return await getAmbulanceReviewsMock();
};