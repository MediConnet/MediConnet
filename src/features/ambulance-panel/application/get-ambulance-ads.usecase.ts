import type { AmbulanceAd } from "../domain/ambulance-ad.entity";
import { getAmbulanceAdsMock } from "../infrastructure/ambulance-ads.mock";

export const getAmbulanceAdsUseCase = async (): Promise<AmbulanceAd[]> => {
  return await getAmbulanceAdsMock();
};