import { updateAdminSettingsAPI } from '../infrastructure/dashboard.api';
import type { AdminSettings } from '../domain/admin-settings.entity';

/**
 * Caso de uso: Actualizar configuración de administración
 */
export const updateAdminSettingsUseCase = async (
  settings: Partial<AdminSettings>
): Promise<AdminSettings> => {
  return await updateAdminSettingsAPI(settings);
};
