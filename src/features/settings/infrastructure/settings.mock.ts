import type { AdminSettings } from "../domain/admin-settings.entity";

export const MOCK_ADMIN_SETTINGS: AdminSettings = {
  notifyNewRequests: true,
  notifyEmailSummary: true,
  autoApproveServices: false,
  maintenanceMode: false,
};

export const getAdminSettingsMock = (): Promise<AdminSettings> => {
  return Promise.resolve(MOCK_ADMIN_SETTINGS);
};