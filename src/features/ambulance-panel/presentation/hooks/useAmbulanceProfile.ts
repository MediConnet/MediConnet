import { useEffect, useState } from "react";
import { getAmbulanceProfileUseCase } from "../../application/get-ambulance-profile.usecase";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

export const useAmbulanceProfile = () => {
  const [profile, setProfile] = useState<AmbulanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAmbulanceProfileUseCase();
        setProfile(data);
      } catch (error: any) {
        console.error("❌ [HOOK] Error loading ambulance profile:", error);
        const errorMessage = error.response?.data?.message || error.message || "Error al cargar el perfil";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};