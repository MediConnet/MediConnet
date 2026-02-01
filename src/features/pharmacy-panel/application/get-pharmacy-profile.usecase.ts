import type { PharmacyProfile } from "../domain/pharmacy-profile.entity";
import { getPharmacyProfileAPI } from "../infrastructure/pharmacy.api";

export const getPharmacyProfileUseCase = async (): Promise<PharmacyProfile> => {
  return await getPharmacyProfileAPI();
};