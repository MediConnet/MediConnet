import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getAmbulanceProfileUseCase } from "../../application/get-ambulance-profile.usecase";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

/**
 * Hook: Obtener perfil de ambulancia
 * Migrado a React Query
 */
export const useAmbulanceProfile = () => {
  const { user } = useAuthStore();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<AmbulanceProfile>({
    queryKey: ['ambulances', 'profile', user?.id],
    queryFn: getAmbulanceProfileUseCase,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    profile: profile || null,
    isLoading,
    error: error ? (error as any)?.response?.data?.message || error.message || "Error al cargar el perfil" : null,
  };
};