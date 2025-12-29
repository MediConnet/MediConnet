import type { ProviderRequest } from "../domain/provider-request.entity";
import { MOCK_REQUESTS } from "./requests.mock";

// Simulamos una llamada a la API con un pequeño retraso
export const getProviderRequestsAPI = async (): Promise<ProviderRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REQUESTS);
    }, 800); // 800ms de delay para que se vea el estado de carga
  });
};