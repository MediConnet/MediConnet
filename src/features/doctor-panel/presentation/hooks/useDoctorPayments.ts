import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getDoctorPaymentsAPI } from "../../infrastructure/doctors.api";

/**
 * Hook: Obtener pagos del doctor
 */
export const useDoctorPayments = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['doctors', 'payments', user?.id],
    queryFn: getDoctorPaymentsAPI,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
