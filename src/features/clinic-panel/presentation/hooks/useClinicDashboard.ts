import { useQuery } from '@tanstack/react-query';
import { getClinicDashboardUseCase } from '../../application/get-clinic-dashboard.usecase';
import type { ClinicDashboard } from '../../domain/clinic.entity';
import { useAuthStore } from '../../../../app/store/auth.store';

/**
 * Hook: Obtener dashboard de la clínica
 * Migrado a React Query
 */
export const useClinicDashboard = () => {
  const { user } = useAuthStore();

  const getDefaultData = (): ClinicDashboard => ({
    totalDoctors: 0,
    activeDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    clinic: {
      id: user?.id || "",
      name: user?.name || "Clínica",
      logoUrl: undefined,
      specialties: [],
      address: "",
      phone: "",
      whatsapp: "",
      generalSchedule: {
        monday: { enabled: false, startTime: "", endTime: "" },
        tuesday: { enabled: false, startTime: "", endTime: "" },
        wednesday: { enabled: false, startTime: "", endTime: "" },
        thursday: { enabled: false, startTime: "", endTime: "" },
        friday: { enabled: false, startTime: "", endTime: "" },
        saturday: { enabled: false, startTime: "", endTime: "" },
        sunday: { enabled: false, startTime: "", endTime: "" },
      },
      description: "",
      isActive: true,
    },
  });

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ClinicDashboard>({
    queryKey: ['clinics', 'dashboard', user?.id],
    queryFn: () => {
      return getClinicDashboardUseCase().catch((err) => {
        console.warn('Error al cargar dashboard de clínica, usando datos por defecto:', err);
        return getDefaultData();
      });
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    placeholderData: getDefaultData(),
  });

  return { data: data || getDefaultData(), loading, error, refetch };
};
