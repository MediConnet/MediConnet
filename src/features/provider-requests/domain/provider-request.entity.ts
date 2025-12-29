import type { RequestStatusType } from "./request-status.enum";

export type ServiceType = 'doctor' | 'pharmacy' | 'laboratory' | 'ambulance' | 'supplies';

// Definimos la estructura de un documento
export interface ProviderDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string; // En un caso real, esto sería la URL de S3 o Firebase Storage
}

export interface ProviderRequest {
  id: string;
  providerName: string;
  email: string;
  avatarUrl?: string;
  serviceType: ServiceType;
  submissionDate: string;
  documentsCount: number;
  status: RequestStatusType;
  
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  description: string;
  documents: ProviderDocument[]; 
}