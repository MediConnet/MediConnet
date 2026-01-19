import type { RequestStatusType } from "./request-status.enum";
import type { ServiceType } from "./provider-request.entity";

export interface AdContent {
  // Campos del banner promocional
  label: string; // Ej: "PRIMERA CITA"
  discount: string; // Ej: "20% OFF"
  description: string; // Ej: "En tu primera consulta general con profesionales verificados."
  buttonText: string; // Ej: "Canjear Ahora"
  imageUrl?: string; // Imagen de profesionales
  // Fechas
  startDate: string;
  endDate?: string;
  // Campos legacy (mantener para compatibilidad)
  title?: string; // Deprecated: usar label + discount
}

export interface AdRequest {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  serviceType: ServiceType;
  submissionDate: string;
  status: RequestStatusType;
  rejectionReason?: string; // Motivo de rechazo si fue rechazado
  approvedAt?: string; // Fecha de aprobación
  rejectedAt?: string; // Fecha de rechazo
  hasActiveAd: boolean; // Si ya tiene un anuncio activo
  adContent?: AdContent; // Contenido del anuncio que se está solicitando
}

