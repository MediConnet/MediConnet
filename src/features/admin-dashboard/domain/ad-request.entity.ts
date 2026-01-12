import type { RequestStatusType } from "./request-status.enum";
import type { ServiceType } from "./provider-request.entity";

export interface AdContent {
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
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

