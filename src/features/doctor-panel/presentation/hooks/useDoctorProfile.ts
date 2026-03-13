import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { DoctorDashboard } from "../../domain/DoctorDashboard.entity";
import { getDoctorProfileAPI } from "../../infrastructure/doctors.api";

/**
 * Hook: Obtener perfil del doctor
 * Migrado a React Query para mejor gestión de caché y estados
 */
export const useDoctorProfile = () => {
  const { user } = useAuthStore();

  const {
    data: profileData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<DoctorDashboard>({
    queryKey: ['doctors', 'profile', user?.id],
    queryFn: getDoctorProfileAPI,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    profileData: profileData || null,
    loading,
    error,
    refetch,
  };
};