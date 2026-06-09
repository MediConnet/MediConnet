import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../app/store/auth.store';
import { useFeedbackStore } from '../../../app/store/feedback.store';
import { getClinicProfileUseCase } from '../services/get-clinic-profile.usecase';
import { updateClinicProfileUseCase } from '../services/update-clinic-profile.usecase';
import type { ClinicProfile } from '../types/clinic.entity';

export const useClinicProfile = () => {
  const { user } = useAuthStore();

  const {
    data: profile,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ClinicProfile>({
    queryKey: ['clinics', 'profile', user?.id],
    queryFn: getClinicProfileUseCase,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  return { profile: profile || null, loading, error, refetch };
};

export const useUpdateClinicProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const feedback = useFeedbackStore();

  return useMutation<ClinicProfile, Error, Partial<ClinicProfile>>({
    mutationFn: updateClinicProfileUseCase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clinics', 'profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['clinics', 'dashboard', user?.id] });
      queryClient.setQueryData(['clinics', 'profile', user?.id], data);
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    },
  });
};
