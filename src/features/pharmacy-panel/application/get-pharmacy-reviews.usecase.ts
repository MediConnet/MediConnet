import type { PharmacyReview } from "../domain/pharmacy-review.entity";
import { getPharmacyReviewsAPI } from "../infrastructure/pharmacy.api";
import { getPharmacyReviewsMock } from "../infrastructure/pharmacy-reviews.mock";

export const getPharmacyReviewsUseCase = async (): Promise<PharmacyReview[]> => {
  try {
    const data: unknown = await getPharmacyReviewsAPI();

    // Normalización defensiva por si el backend cambia la forma
    if (Array.isArray(data)) return data as PharmacyReview[];
    if (data && typeof data === "object") {
      const maybe = data as any;
      if (Array.isArray(maybe.reviews)) return maybe.reviews as PharmacyReview[];
      if (Array.isArray(maybe.data)) return maybe.data as PharmacyReview[];
    }

    throw new Error("Invalid pharmacy reviews response shape");
  } catch (error) {
    // Fallback local para no romper UI si el endpoint aún no está listo
    return await getPharmacyReviewsMock();
  }
};