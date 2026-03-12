import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
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

  return useMutation<DoctorDashboard, Error, UpdateDoctorProfileParams>({
    mutationFn: updateDoctorProfileAPI,
    onSuccess: () => {
      // Invalidar cache del perfil
      queryClient.invalidateQueries({ queryKey: ['doctors', 'profile', user?.id] });
      // Invalidar cache del dashboard (puede tener datos del perfil)
      queryClient.invalidateQueries({ queryKey: ['doctors', 'dashboard', user?.id] });
    },
  });
};
