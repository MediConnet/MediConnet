import type { PharmacyAd } from "../domain/pharmacy-ad.entity";

// Array vacío para simular el estado inicial
export const MOCK_PHARMACY_ADS: PharmacyAd[] = [];

export const getPharmacyAdsMock = (): Promise<PharmacyAd[]> => {
  return Promise.resolve(MOCK_PHARMACY_ADS);
};