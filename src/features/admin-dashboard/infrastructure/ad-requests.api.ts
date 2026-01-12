import type { AdRequest } from "../domain/ad-request.entity";
import { MOCK_AD_REQUESTS } from "./ad-requests.mock";
import { createAdUseCase } from "../application/create-ad.usecase";

export const getAdRequestsAPI = async (): Promise<AdRequest[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(MOCK_AD_REQUESTS);
};

export const approveAdRequestAPI = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = MOCK_AD_REQUESTS.find((r) => r.id === id);
  if (request && request.adContent) {
    request.status = "APPROVED";
    request.approvedAt = new Date().toISOString().split("T")[0];
    
    // Crear el anuncio automáticamente con el contenido de la solicitud
    await createAdUseCase(request.providerId, request.adContent);
    request.hasActiveAd = true;
  }
};

export const rejectAdRequestAPI = async (
  id: string,
  reason: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const request = MOCK_AD_REQUESTS.find((r) => r.id === id);
  if (request) {
    request.status = "REJECTED";
    request.rejectedAt = new Date().toISOString().split("T")[0];
    request.rejectionReason = reason;
  }
};

