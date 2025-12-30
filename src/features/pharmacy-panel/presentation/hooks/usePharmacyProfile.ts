import { useEffect, useState } from "react";
import { getPharmacyProfileUseCase } from "../../application/get-pharmacy-profile.usecase";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";

export const usePharmacyProfile = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacyProfileUseCase();
        setProfile(data);
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