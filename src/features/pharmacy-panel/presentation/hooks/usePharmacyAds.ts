import { useEffect, useState } from "react";
import { getPharmacyAdsUseCase } from "../../application/get-pharmacy-ads.usecase";
import type { PharmacyAd } from "../../domain/pharmacy-ad.entity";

export const usePharmacyAds = () => {
  const [ads, setAds] = useState<PharmacyAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacyAdsUseCase();
        setAds(data);
      } catch (error) {
        console.error("Error cargando anuncios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  return { ads, isLoading };
};