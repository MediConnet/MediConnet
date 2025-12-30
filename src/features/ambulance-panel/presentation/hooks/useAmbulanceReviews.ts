import { useEffect, useState } from "react";
import { getAmbulanceReviewsUseCase } from "../../application/get-reviews.usecase";
import type { Review } from "../../domain/review.entity";

export const useAmbulanceReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getAmbulanceReviewsUseCase();
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, isLoading };
};