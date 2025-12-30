import type { PharmacySettings } from "../domain/pharmacy-settings.entity";
import { getPharmacySettingsMock } from "../infrastructure/pharmacy-settings.mock";

export const getPharmacySettingsUseCase = async (): Promise<PharmacySettings> => {
  return await getPharmacySettingsMock();
};