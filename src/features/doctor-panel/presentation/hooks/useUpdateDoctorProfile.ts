import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import {
  updateDoctorProfileAPI,
  type UpdateDoctorProfileParams,
} from "../../infrastructure/doctors.api";
import type { DoctorDashboard } from "../../domain/DoctorDashboard.entity";

/**
 * Hook: Actualizar perfil del doctor
 * Con invalidación automática del cache relacionado
 */
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const feedback = useFeedbackStore();

  return useMutation<DoctorDashboard, Error, UpdateDoctorProfileParams>({
    mutationFn: updateDoctorProfileAPI,
    onSuccess: () => {
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (error) => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
      console.error('Error en useUpdateDoctorProfile:', error);
    },
  });
};
