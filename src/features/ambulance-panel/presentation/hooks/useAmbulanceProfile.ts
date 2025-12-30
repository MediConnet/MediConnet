import { useEffect, useState } from "react";
import { getAmbulanceProfileUseCase } from "../../application/get-ambulance-profile.usecase";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

export const useAmbulanceProfile = () => {
  const [profile, setProfile] = useState<AmbulanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getAmbulanceProfileUseCase();
        setProfile(data);
      } catch (error) {
        console.error("Error loading ambulance profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading };
};