import type { RequestStatusType } from "./request-status.enum";

// Definimos los tipos de servicio posibles
export type ServiceType = 'doctor' | 'pharmacy' | 'laboratory' | 'ambulance' | 'supplies';

export interface ProviderRequest {
  id: string;
  providerName: string;
  email: string;
  avatarUrl?: string; 
  serviceType: ServiceType;
  submissionDate: string; 
  documentsCount: number;
  status: RequestStatusType;
}