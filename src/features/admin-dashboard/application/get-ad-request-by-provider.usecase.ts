import type { AdRequest } from "../domain/ad-request.entity";
import { getAdRequests } from "../infrastructure/ad-requests.mock";
import { loadAdsFromStorage } from "../infrastructure/ads.mock";

export const getAdRequestByProviderUseCase = async (
  providerId: string
): Promise<AdRequest | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const requests = getAdRequests();
  const request = requests.find(
    (r) => r.providerId === providerId && r.status === "PENDING"
  );
  return request || null;
};

export const hasActiveAdUseCase = async (
  providerId: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Verificar si hay un anuncio activo en los anuncios creados
  const ads = loadAdsFromStorage();
  const activeAd = ads.find(
    (ad) => ad.providerId === providerId && ad.status === "active"
  );
  if (activeAd) return true;

  // También verificar en las solicitudes (backward compatibility)
  const requests = getAdRequests();
  const request = requests.find(
    (r) => r.providerId === providerId && r.hasActiveAd === true
  );
  return !!request;
};

export const hasApprovedAdRequestUseCase = async (
  providerId: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const requests = getAdRequests();
  // Verificar si hay una solicitud aprobada pero sin anuncio activo
  const approvedRequest = requests.find(
    (r) => r.providerId === providerId && r.status === "APPROVED" && !r.hasActiveAd
  );
  
  // Si tiene solicitud aprobada, verificar que no tenga anuncio activo
  if (approvedRequest) {
    const ads = loadAdsFromStorage();
    const activeAd = ads.find(
      (ad) => ad.providerId === providerId && ad.status === "active"
    );
    return !activeAd;
  }
  
  return false;
};

