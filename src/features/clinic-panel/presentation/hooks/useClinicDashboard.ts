import { useState, useEffect } from 'react';
import { getClinicDashboardUseCase } from '../../application/get-clinic-dashboard.usecase';
import type { ClinicDashboard } from '../../domain/clinic.entity';
import { useAuthStore } from '../../../../app/store/auth.store';

export const useClinicDashboard = () => {
  const [data, setData] = useState<ClinicDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await getClinicDashboardUseCase();
      setData(dashboard);
    } catch (err) {
      // Si hay error, usar datos por defecto para que la UI funcione
      console.warn('Error al cargar dashboard de clínica, usando datos por defecto:', err);
      setData(getDefaultData());
      // No establecer error si queremos que la UI funcione con datos vacíos
      // setError(err instanceof Error ? err : new Error('Error al cargar dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};
