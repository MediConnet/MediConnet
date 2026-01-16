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

  // Guardar en localStorage en lugar de modificar el array constante
  const saved = localStorage.getItem("ad-requests");
  let requests: AdRequest[] = [];
  
  if (saved) {
    try {
      requests = JSON.parse(saved);
    } catch (error) {
      console.error("Error loading ad requests from localStorage:", error);
      // Si hay error, usar los mocks iniciales
      requests = [...MOCK_AD_REQUESTS];
    }
  } else {
    // Primera vez: usar los mocks iniciales
    requests = [...MOCK_AD_REQUESTS];
  }

  // Agregar la nueva solicitud
  requests.push(newRequest);
  
  // Guardar de vuelta en localStorage
  localStorage.setItem("ad-requests", JSON.stringify(requests));

  return newRequest;
};

