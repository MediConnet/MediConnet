import { useQuery } from "@tanstack/react-query";
import {
  getDoctorPanelReviewsAPI,
  type DoctorReview,
} from "../../infrastructure/doctors.api";

interface DoctorReviewsResponse {
  reviews: DoctorReview[];
  averageRating: number;
  totalReviews: number;
}

/**
 * Hook: Obtener reseñas del panel de doctor (proveedor autenticado)
 * Usa el endpoint: GET /api/doctors/reviews
 */
export const useDoctorReviews = () => {
  return useQuery<DoctorReviewsResponse>({
    queryKey: ["doctor-panel-reviews"],
    queryFn: () => getDoctorPanelReviewsAPI(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  });
};

