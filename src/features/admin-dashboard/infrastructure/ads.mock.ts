import type { Ad } from "../domain/ad.entity";

export const MOCK_ADS: Ad[] = [];

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

