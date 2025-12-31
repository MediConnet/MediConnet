import type { PharmacyAd } from "../domain/pharmacy-ad.entity";
import { getPharmacyAdsMock } from "../infrastructure/pharmacy-ads.mock";

export const getPharmacyAdsUseCase = async (): Promise<PharmacyAd[]> => {
  // Aquí iría la lógica de negocio si la hubiera (filtros, etc.)
  return await getPharmacyAdsMock();
};