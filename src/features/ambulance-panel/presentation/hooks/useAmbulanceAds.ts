import { useEffect, useState } from "react";
import { getAmbulanceAdsUseCase } from "../../application/get-ambulance-ads.usecase";
import type { AmbulanceAd } from "../../domain/ambulance-ad.entity";

export const useAmbulanceAds = () => {
  const [ads, setAds] = useState<AmbulanceAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const data = await getAmbulanceAdsUseCase();
        setAds(data);
      } catch (error) {
        console.error("Error cargando anuncios de ambulancia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  return { ads, isLoading };
};