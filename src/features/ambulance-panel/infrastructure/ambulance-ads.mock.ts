import type { AmbulanceAd } from "../domain/ambulance-ad.entity";

// Array vacío para mostrar el estado "sin anuncios"
export const MOCK_AMBULANCE_ADS: AmbulanceAd[] = [];

export const getAmbulanceAdsMock = (): Promise<AmbulanceAd[]> => {
  return Promise.resolve(MOCK_AMBULANCE_ADS);
};