import { useState, useEffect, useCallback } from "react";
import { getPharmacyReviewsUseCase } from "../../application/get-pharmacy-reviews.usecase";
import type { PharmacyReview } from "../../domain/pharmacy-review.entity";

export const usePharmacyReviews = () => {
  const [reviews, setReviews] = useState<PharmacyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPharmacyReviewsUseCase({ page, limit });
      setReviews(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { reviews, loading, total, page, setPage, limit, setLimit, refetch: loadData };
};