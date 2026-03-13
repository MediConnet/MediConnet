import type { AdminSettings } from "../domain/admin-settings.entity";
import { getAdminSettingsAPI } from "../infrastructure/dashboard.api";

export const getAdminSettingsUseCase = async (): Promise<AdminSettings> => {
  console.log("🔵 getAdminSettingsUseCase: Llamando al backend...");
  const result = await getAdminSettingsAPI();
  console.log("🔵 getAdminSettingsUseCase: Respuesta del backend:", result);
  return result;
};