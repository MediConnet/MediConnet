export interface PharmacyStats {
  profileViews: number;
  contactClicks: number;
  totalReviews: number;
  averageRating: number;
}

export interface WorkSchedule {
  day: string; // "monday", "tuesday", etc.
  isOpen: boolean;
  startTime: string; // "09:00"
  endTime: string; // "18:00"
}

export interface PharmacyProfile {
  id: string;
  commercialName: string;
  logoUrl: string;      
  ruc: string;          
  description: string;  
  websiteUrl: string;   
  address: string; // Dirección principal
  status: "draft" | "published" | "suspended"; // Estado del perfil
  whatsapp: string; // Número de WhatsApp
  chainId?: string; // ID de la cadena de farmacias (opcional)
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  }; // Ubicación (coordenadas)
  schedule: WorkSchedule[]; // Horarios de atención
  stats: PharmacyStats;
  isActive?: boolean; // Estado del servicio: Activo / Inactivo
}