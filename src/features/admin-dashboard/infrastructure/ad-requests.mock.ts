import type { AdRequest } from "../domain/ad-request.entity";

// Mocks iniciales vacíos - el usuario puede crear sus propias solicitudes de prueba
const INITIAL_MOCK_AD_REQUESTS: AdRequest[] = [];

// Función helper para obtener todas las solicitudes (desde localStorage o mocks iniciales)
export const getAdRequests = (): AdRequest[] => {
  const saved = localStorage.getItem("ad-requests");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error loading ad requests from localStorage:", error);
      // Si hay error, retornar array vacío
      return [];
    }
  }
  // Primera vez: retornar array vacío (sin mocks)
  return [];
};

// Función helper para guardar solicitudes en localStorage
export const saveAdRequests = (requests: AdRequest[]): void => {
  localStorage.setItem("ad-requests", JSON.stringify(requests));
};

// Limpiar todas las solicitudes de anuncios
export const clearAdRequests = (): void => {
  localStorage.removeItem("ad-requests");
};

// Exportar los mocks iniciales para compatibilidad
export const MOCK_AD_REQUESTS = INITIAL_MOCK_AD_REQUESTS;

