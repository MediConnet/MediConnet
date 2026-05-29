import { useState, useEffect, useCallback } from "react";
import { getAmbulanceReviewsUseCase } from "../../application/get-reviews.usecase";
import type { Review } from "../../domain/review.entity";

export const useAmbulanceReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAmbulanceReviewsUseCase({ page, limit });
      setReviews(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { reviews, loading, total, page, setPage, limit, setLimit, refetch: loadData };
};