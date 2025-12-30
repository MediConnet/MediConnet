import type { AmbulanceSettings } from "../domain/ambulance-settings.entity";
import { getAmbulanceSettingsMock } from "../infrastructure/settings.mock";

export const getAmbulanceSettingsUseCase = async (): Promise<AmbulanceSettings> => {
  return await getAmbulanceSettingsMock();
};