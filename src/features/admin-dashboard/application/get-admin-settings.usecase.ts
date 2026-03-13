import type { AdminSettings } from "../domain/admin-settings.entity";
import { getAdminSettingsAPI } from "../infrastructure/dashboard.api";

export const getAdminSettingsUseCase = async (): Promise<AdminSettings> => {
  return await getAdminSettingsAPI();
};