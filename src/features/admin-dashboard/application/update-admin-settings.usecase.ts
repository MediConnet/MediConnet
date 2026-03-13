import { updateAdminSettingsAPI } from '../infrastructure/dashboard.api';
import type { AdminSettings } from '../domain/admin-settings.entity';

/**
 * Caso de uso: Actualizar configuración de administración
 */
export const updateAdminSettingsUseCase = async (
  settings: Partial<AdminSettings>
): Promise<AdminSettings> => {
  console.log("🟢 updateAdminSettingsUseCase: Enviando al backend:", settings);
  const result = await updateAdminSettingsAPI(settings);
  console.log("🟢 updateAdminSettingsUseCase: Respuesta del backend:", result);
  return result;
};
