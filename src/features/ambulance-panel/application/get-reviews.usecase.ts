import type { Review } from "../domain/review.entity";
import { getAmbulanceReviewsAPI } from "../infrastructure/ambulance-reviews.api";
import { getAmbulanceReviewsMock } from "../infrastructure/reviews.mock";

export const getAmbulanceReviewsUseCase = async (): Promise<Review[]> => {
  try {
    const data: unknown = await getAmbulanceReviewsAPI();

    if (Array.isArray(data)) return data as Review[];
    if (data && typeof data === "object") {
      const maybe = data as any;
      if (Array.isArray(maybe.reviews)) return maybe.reviews as Review[];
      if (Array.isArray(maybe.data)) return maybe.data as Review[];
    }

    throw new Error("Invalid ambulance reviews response shape");
  } catch (error) {
    // Fallback local para no romper UI si el endpoint aún no está listo
    return await getAmbulanceReviewsMock();
  }
};