import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../app/store/auth.store";
import { useFeedbackStore } from "../../../app/store/feedback.store";
import {
  getDoctorScheduleAPI,
  updateDoctorScheduleAPI,
} from "../api/doctors.api";
import type { WorkSchedule } from "../types/DoctorDashboard.entity";

export const useDoctorSchedule = () => {
  const { user } = useAuthStore();

  return useQuery<WorkSchedule[]>({
    queryKey: ['doctors', 'schedule', user?.id],
    queryFn: getDoctorScheduleAPI,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};

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
