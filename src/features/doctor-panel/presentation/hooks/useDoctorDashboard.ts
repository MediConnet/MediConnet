import { useQuery } from "@tanstack/react-query";
import type { DoctorDashboard, ProfileStatus, PaymentMethod } from "../../domain/DoctorDashboard.entity";
import { getDoctorDashboardUseCase } from "../../application/get-doctor-dashboard.usecase";
import { useAuthStore } from "../../../../app/store/auth.store";

/**
 * Hook: Obtener dashboard del doctor
 * Migrado a React Query para mejor gestión de caché y estados
 */
export const useDoctorDashboard = () => {
  const { user } = useAuthStore();

  // Función para crear datos por defecto para usuarios nuevos
  const getDefaultData = (): DoctorDashboard => ({
    visits: 0,
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      name: user?.name || "Dr. Usuario",
      specialty: "Médico",
      email: user?.email || "",
      whatsapp: "",
      address: "",
      price: 0,
      description: "",
      isActive: true,
      profileStatus: 'draft' as ProfileStatus,
      paymentMethods: 'both' as PaymentMethod,
    },
  });

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<DoctorDashboard>({
    queryKey: ['doctors', 'dashboard', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve(getDefaultData());
      }
      return getDoctorDashboardUseCase(user.id).catch((err) => {
        console.error('Error loading doctor dashboard:', err);
        // En caso de error, retornar datos por defecto
        return getDefaultData();
      });
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    // Datos por defecto mientras carga
    placeholderData: getDefaultData(),
  });

  return {
    data: data || getDefaultData(),
    loading: isLoading,
    error,
    refetch,
    setData: () => {}, // Mantener compatibilidad, pero React Query maneja esto
  };
};
