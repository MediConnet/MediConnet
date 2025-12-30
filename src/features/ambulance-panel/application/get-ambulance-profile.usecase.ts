import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";
import { getAmbulanceProfileMock } from "../infrastructure/ambulance.mock";

export const getAmbulanceProfileUseCase = async (): Promise<AmbulanceProfile> => {
  return await getAmbulanceProfileMock();
};