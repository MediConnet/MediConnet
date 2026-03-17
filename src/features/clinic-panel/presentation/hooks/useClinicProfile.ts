import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../app/store/auth.store';
import { getClinicProfileUseCase } from '../../application/get-clinic-profile.usecase';
import { updateClinicProfileUseCase } from '../../application/update-clinic-profile.usecase';
import type { ClinicProfile } from '../../domain/clinic.entity';

/**
 * Hook: Obtener perfil de la clínica
 * Migrado a React Query
 */
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
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return { profile: profile || null, loading, error, refetch };
};

/**
 * Hook: Actualizar perfil de la clínica
 * Con invalidación automática del cache
 */
export const useUpdateClinicProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<ClinicProfile, Error, Partial<ClinicProfile>>({
    mutationFn: updateClinicProfileUseCase,
    onSuccess: (data) => {
      // Invalidar cache del perfil
      queryClient.invalidateQueries({ queryKey: ['clinics', 'profile', user?.id] });
      // Invalidar cache del dashboard (puede tener datos del perfil)
      queryClient.invalidateQueries({ queryKey: ['clinics', 'dashboard', user?.id] });
      // Actualizar cache optimísticamente
      queryClient.setQueryData(['clinics', 'profile', user?.id], data);
    },
  });
};
