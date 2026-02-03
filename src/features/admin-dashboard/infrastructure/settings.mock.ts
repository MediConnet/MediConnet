import type { AdminSettings } from "../domain/admin-settings.entity";

export const MOCK_ADMIN_SETTINGS: AdminSettings = {
  notifyNewRequests: true,
  notifyEmailSummary: true,
  autoApproveServices: false,
  maintenanceMode: false,
  onlyAdminCanPublishAds: true, // Solo el admin puede publicar anuncios
  requireAdApproval: true, // Requiere aprobación antes de publicar
  maxAdsPerProvider: 1, // Máximo de anuncios por proveedor
  adApprovalRequired: true, // Aprobación requerida para anuncios
  serviceApprovalRequired: true, // Aprobación requerida para servicios
  allowServiceSelfActivation: false, // No permitir auto-activación
  allowAdSelfPublishing: false, // No permitir auto-publicación (solo admin)
};

export const getAdminSettingsMock = (): Promise<AdminSettings> => {
  return Promise.resolve(MOCK_ADMIN_SETTINGS);
};