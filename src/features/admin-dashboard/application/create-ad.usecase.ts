import type { Ad } from "../domain/ad.entity";
import { saveAdsToStorage, loadAdsFromStorage } from "../infrastructure/ads.mock";
import { MOCK_AD_REQUESTS } from "../infrastructure/ad-requests.mock";

export const createAdUseCase = async (
  providerId: string,
  adData: {
    label: string;
    discount: string;
    description: string;
    buttonText: string;
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
    label: adData.label,
    discount: adData.discount,
    description: adData.description,
    buttonText: adData.buttonText,
    imageUrl: adData.imageUrl,
    startDate: adData.startDate,
    endDate: adData.endDate,
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
  
  // Si el anuncio existe, verificar si ha expirado
  if (ad && ad.endDate) {
    const now = new Date().getTime();
    const endDate = new Date(ad.endDate).getTime();
    
    // Si el anuncio ha expirado, marcarlo como inactivo
    if (endDate < now) {
      ad.status = "inactive";
      // Guardar los cambios
      const allAds = loadAdsFromStorage();
      const adIndex = allAds.findIndex((a) => a.id === ad.id);
      if (adIndex !== -1) {
        allAds[adIndex] = ad;
        saveAdsToStorage(allAds);
      }
      return null; // No retornar anuncios expirados
    }
  }
  
  return ad || null;
};

