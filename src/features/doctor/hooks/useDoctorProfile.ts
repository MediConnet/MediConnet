import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../app/store/auth.store";
import type { DoctorDashboard } from "../types/DoctorDashboard.entity";
import { getDoctorProfileAPI } from "../api/doctors.api";

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
    staleTime: 2 * 60 * 1000,
  });

  return {
    profileData: profileData || null,
    loading,
    error,
    refetch,
  };
};
