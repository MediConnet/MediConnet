import type { AdminSettings } from "../domain/admin-settings.entity";
import { getAdminSettingsMock } from "../infrastructure/settings.mock";

export const getAdminSettingsUseCase = async (): Promise<AdminSettings> => {
  return await getAdminSettingsMock();
};