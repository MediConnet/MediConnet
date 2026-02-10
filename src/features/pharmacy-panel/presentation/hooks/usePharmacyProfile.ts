import { useEffect, useState } from "react";
import { getPharmacyProfileUseCase } from "../../application/get-pharmacy-profile.usecase";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";
import { getPharmacyChains } from "../../../../shared/lib/pharmacy-chains";

export const usePharmacyProfile = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacyProfileUseCase();

        // Si el backend no trae datos completos de cadena, intentamos completarlos por chainId
        if (
          data?.chainId &&
          (!data.chainName || !data.chainLogo || !data.chainDescription)
        ) {
          const chains = await getPharmacyChains();
          const chain = chains.find((c) => c.id === data.chainId);
          if (chain) {
            setProfile({
              ...data,
              isChainMember: true,
              chainName: data.chainName || chain.name,
              chainLogo: data.chainLogo || chain.logoUrl,
              chainDescription: data.chainDescription || chain.description,
            });
          } else {
            setProfile(data);
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("Error al cargar el perfil de la farmacia.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error, setProfile };
};