import type { PharmacyProfile } from "../domain/pharmacy-profile.entity";
import { getPharmacyProfileMock } from "../infrastructure/pharmacy.mock";

export const getPharmacyProfileUseCase = async (): Promise<PharmacyProfile> => {
  // En el futuro, aquí iría la lógica real para obtener el perfil de la farmacia
  return await getPharmacyProfileMock();
};