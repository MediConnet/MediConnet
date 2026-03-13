import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import {
  getDoctorAppointmentsAPI,
  updateAppointmentStatusAPI,
} from "../../infrastructure/doctors.api";

/**
 * Hook: Obtener citas del doctor
 * Con refetch automático para mantener datos actualizados
 */
export const useDoctorAppointments = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['doctors', 'appointments', user?.id],
    queryFn: getDoctorAppointmentsAPI,
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 segundos (cambian frecuentemente)
    refetchInterval: 60 * 1000, // Refrescar cada minuto
  });
};

/**
 * Hook: Actualizar estado de una cita
 * Con invalidación automática del cache de appointments
 */
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      updateAppointmentStatusAPI(appointmentId, status),
    onSuccess: () => {
      // Invalidar cache para refrescar la lista de appointments
      queryClient.invalidateQueries({ queryKey: ['doctors', 'appointments', user?.id] });
      // También invalidar dashboard que puede mostrar estadísticas
      queryClient.invalidateQueries({ queryKey: ['doctors', 'dashboard', user?.id] });
    },
  });
};
