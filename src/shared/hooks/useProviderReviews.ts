import { useState, useEffect, useCallback } from "react";
import { httpClient } from "../api/httpClient";
import type { PaginatedResponse } from "../types/pagination";

export interface ProviderReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userName: string;
  profilePictureUrl: string | null;
  branchName?: string | null;
}

interface UseProviderReviewsParams {
  endpoint: string; // e.g., '/doctors/reviews', '/pharmacies/reviews'
  enabled?: boolean;
}

/**
 * Hook genérico para obtener reseñas de cualquier tipo de proveedor
 * Elimina la duplicación de código entre useDoctorReviews, usePharmacyReviews, etc.
 */
export const useProviderReviews = ({ endpoint, enabled = true }: UseProviderReviewsParams) => {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: {
          reviews: ProviderReview[];
          averageRating: number;
          totalReviews: number;
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>(endpoint, {
        params: { page, limit },
      });

      if (response.data.success && response.data.data) {
        setReviews(response.data.data.reviews || []);
        setTotal(response.data.data.pagination?.total || 0);
        setAverageRating(response.data.data.averageRating || 0);
      }
    } catch (error) {
      console.error(`Error cargando reseñas desde ${endpoint}:`, error);
      setReviews([]);
      setTotal(0);
      setAverageRating(0);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, limit, enabled]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    reviews,
    loading,
    total,
    averageRating,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
  };
};
