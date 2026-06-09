import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
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
  const feedback = useFeedbackStore();

  return useMutation<WorkSchedule[], Error, WorkSchedule[]>({
    mutationFn: updateDoctorScheduleAPI,
    onSuccess: () => {
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['doctors', 'schedule', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['doctors', 'profile', user?.id] });
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });
};
