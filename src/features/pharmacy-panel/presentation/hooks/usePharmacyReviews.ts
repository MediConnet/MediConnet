import { useEffect, useState } from "react";
import { getPharmacyReviewsUseCase } from "../../application/get-pharmacy-reviews.usecase";
import type { PharmacyReview } from "../../domain/pharmacy-review.entity";

export const usePharmacyReviews = () => {
  const [reviews, setReviews] = useState<PharmacyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacyReviewsUseCase();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, isLoading };
};