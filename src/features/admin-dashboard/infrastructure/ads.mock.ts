import type { Ad } from "../domain/ad.entity";

// Guardar en localStorage
export const saveAdsToStorage = (ads: Ad[]) => {
  localStorage.setItem("ads", JSON.stringify(ads));
};

// Cargar de localStorage
export const loadAdsFromStorage = (): Ad[] => {
  try {
    const saved = localStorage.getItem("ads");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Limpiar todos los anuncios del localStorage
export const clearAdsFromStorage = (): void => {
  localStorage.removeItem("ads");
  localStorage.removeItem("ad-requests");
};

