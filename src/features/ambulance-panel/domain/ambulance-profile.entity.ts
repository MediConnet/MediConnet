export interface AmbulanceProfile {
  id: string;
  bannerUrl: string;
  commercialName: string;
  shortDescription: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  whatsappContact: string;
  emergencyPhone: string;
  arrivalField?: number;
  ambulanceType?: "basic" | "advanced" | "mobile-icu"; // Tipo de ambulancia
  coverageZone?: string; // Zona de cobertura (ej: "Quito y alrededores")
  availability?: "24/7" | "scheduled"; // Disponibilidad 24/7 o por horario
  operatingHours?: {
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
  interprovincialTransfers?: boolean; // Traslados interprovinciales
  isActive?: boolean; // Estado del servicio: Activo / Inactivo

  // Métricas para el dashboard (KPIs)
  stats: {
    profileViews: number;
    contactClicks: number;
    averageRating: number;
    totalReviews: number;
  };
}