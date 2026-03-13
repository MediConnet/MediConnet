import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getDoctorPanelReviewsAPI } from "../../infrastructure/doctors.api";

/**
 * Hook: Obtener reseñas del doctor (panel profesional)
 */
export const useDoctorReviews = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['doctors', 'reviews', user?.id],
    queryFn: getDoctorPanelReviewsAPI,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
