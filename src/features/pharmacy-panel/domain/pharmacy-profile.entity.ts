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
  commercialName: string; // Mapea desde full_name del backend
  logoUrl: string; // Mapea desde profile_picture_url o chainLogo del backend
  ruc: string;
  description: string; // Mapea desde description o chainDescription del backend
  websiteUrl: string;
  address: string; // Dirección principal
  status: "draft" | "published" | "suspended"; // Estado del perfil
  whatsapp: string; // Número de WhatsApp
  chainId?: string; // ID de la cadena de farmacias (opcional)
  
  // ⭐ Nuevos campos del backend
  isChainMember?: boolean; // Indica si pertenece a una cadena
  chainName?: string; // Nombre de la cadena
  chainLogo?: string; // Logo de la cadena
  chainDescription?: string; // Descripción de la cadena
  
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  }; // Ubicación (coordenadas)
  schedule: WorkSchedule[]; // Horarios de atención
  stats: PharmacyStats;
  isActive?: boolean; // Estado del servicio: Activo / Inactivo
}