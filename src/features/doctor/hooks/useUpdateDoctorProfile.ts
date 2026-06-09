import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../app/store/auth.store";
import { useFeedbackStore } from "../../../app/store/feedback.store";
import {
  updateDoctorProfileAPI,
  type UpdateDoctorProfileParams,
} from "../api/doctors.api";
import type { DoctorDashboard } from "../types/DoctorDashboard.entity";

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const feedback = useFeedbackStore();

  return useMutation<DoctorDashboard, Error, UpdateDoctorProfileParams>({
    mutationFn: updateDoctorProfileAPI,
    onSuccess: () => {
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['doctors', 'profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['doctors', 'dashboard', user?.id] });
    },
    onError: (error) => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
      console.error('Error en useUpdateDoctorProfile:', error);
    },
  });
};
