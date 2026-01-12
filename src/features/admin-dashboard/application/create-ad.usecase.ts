import type { Ad } from "../domain/ad.entity";
import { saveAdsToStorage, loadAdsFromStorage } from "../infrastructure/ads.mock";
import { MOCK_AD_REQUESTS } from "../infrastructure/ad-requests.mock";

export const createAdUseCase = async (
  providerId: string,
  adData: {
    title: string;
    description: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }
): Promise<Ad> => {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newAd: Ad = {
    id: `ad-${Date.now()}`,
    providerId,
    ...adData,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Cargar anuncios existentes y agregar el nuevo
  const existingAds = loadAdsFromStorage();
  existingAds.push(newAd);
  saveAdsToStorage(existingAds);

  // Actualizar el estado de la solicitud de anuncio
  const adRequest = MOCK_AD_REQUESTS.find((r) => r.providerId === providerId && r.status === "APPROVED");
  if (adRequest) {
    adRequest.hasActiveAd = true;
  }

  return newAd;
};

export const getAdByProviderUseCase = async (providerId: string): Promise<Ad | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const ads = loadAdsFromStorage();
  const ad = ads.find((a) => a.providerId === providerId && a.status === "active");
  return ad || null;
};

