import type { AdRequest, AdContent } from "../domain/ad-request.entity";
import { MOCK_AD_REQUESTS } from "../infrastructure/ad-requests.mock";

export const createAdRequestUseCase = async (
  providerId: string,
  providerName: string,
  providerEmail: string,
  serviceType: string,
  adContent: AdContent
): Promise<AdRequest> => {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newRequest: AdRequest = {
    id: `ad-${Date.now()}`,
    providerId,
    providerName,
    providerEmail,
    serviceType: serviceType as AdRequest["serviceType"],
    submissionDate: new Date().toISOString().split("T")[0],
    status: "PENDING",
    hasActiveAd: false,
    adContent,
  };

  MOCK_AD_REQUESTS.push(newRequest);
  return newRequest;
};

