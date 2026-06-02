import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../../app/store/auth.store";
import { getDoctorPanelReviewsAPI } from "../api/doctors.api";
import type { DoctorReview } from "../api/doctors.api";

export const useDoctorReviews = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getDoctorPanelReviewsAPI({ page, limit });
      setReviews(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    reviews,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
  };
};
