import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getPharmacyProfileUseCase } from "../../application/get-pharmacy-profile.usecase";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";
import { getPharmacyChains } from "../../../../shared/lib/pharmacy-chains";

/**
 * Hook: Obtener perfil de la farmacia
 * Migrado a React Query
 */
export const usePharmacyProfile = () => {
  const { user } = useAuthStore();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<PharmacyProfile>({
    queryKey: ['pharmacies', 'profile', user?.id],
    queryFn: async () => {
      const data = await getPharmacyProfileUseCase();

      // Si el backend no trae datos completos de cadena, intentamos completarlos por chainId
      if (
        data?.chainId &&
        (!data.chainName || !data.chainLogo || !data.chainDescription)
      ) {
        const chains = await getPharmacyChains();
        const chain = chains.find((c) => c.id === data.chainId);
        if (chain) {
          return {
            ...data,
            isChainMember: true,
            chainName: data.chainName || chain.name,
            chainLogo: data.chainLogo || chain.logoUrl,
            chainDescription: data.chainDescription || chain.description,
          };
        }
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    profile: profile || null,
    isLoading,
    error: error ? "Error al cargar el perfil de la farmacia." : null,
    setProfile: () => {}, // Mantener compatibilidad
  };
};