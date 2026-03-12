import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import {
  getDoctorScheduleAPI,
  updateDoctorScheduleAPI,
} from "../../infrastructure/doctors.api";
import type { WorkSchedule } from "../../domain/DoctorDashboard.entity";

/**
 * Hook: Obtener horario del doctor
 */
export const useDoctorSchedule = () => {
  const { user } = useAuthStore();

  return useQuery<WorkSchedule[]>({
    queryKey: ['doctors', 'schedule', user?.id],
    queryFn: getDoctorScheduleAPI,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook: Actualizar horario del doctor
 * Con invalidación automática del cache
 */
export const useUpdateDoctorSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<WorkSchedule[], Error, WorkSchedule[]>({
    mutationFn: updateDoctorScheduleAPI,
    onSuccess: () => {
      // Invalidar cache del horario
      queryClient.invalidateQueries({ queryKey: ['doctors', 'schedule', user?.id] });
      // Invalidar cache del perfil (puede incluir horario)
      queryClient.invalidateQueries({ queryKey: ['doctors', 'profile', user?.id] });
    },
  });
};
