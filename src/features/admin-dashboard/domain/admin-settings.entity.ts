export interface AdminSettings {
  // Sección Notificaciones
  notifyNewRequests: boolean;
  notifyEmailSummary: boolean;

  // Sección Plataforma
  autoApproveServices: boolean;
  maintenanceMode: boolean;

  // Sección Anuncios
  onlyAdminCanPublishAds: boolean; // Solo el admin puede publicar anuncios
  requireAdApproval: boolean; // Requiere aprobación antes de publicar

  // Sección Reglas Globales
  maxAdsPerProvider: number; // Máximo de anuncios por proveedor
  adApprovalRequired: boolean; // Aprobación requerida para anuncios
  serviceApprovalRequired: boolean; // Aprobación requerida para servicios

  // Sección Estados
  allowServiceSelfActivation: boolean; // Permitir auto-activación de servicios
  allowAdSelfPublishing: boolean; // Permitir auto-publicación de anuncios
}