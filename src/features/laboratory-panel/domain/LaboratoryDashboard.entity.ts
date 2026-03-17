export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  isOpen: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}

export interface LaboratoryStudy {
  id: string;
  name: string; // Tipo de examen
  description?: string | null;
  preparation?: string | null; // Preparación básica
  price?: number;
  is_available?: boolean;
  type?: string | null;
}

export interface LaboratoryDashboard {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
  laboratory: {
    id: string;
    name: string;
    logoUrl?: string; // Logo del laboratorio
    email: string;
    whatsapp: string;
    address: string;
    description: string;
    schedule: string;
    workSchedule?: WorkSchedule[]; // Horario laboral
    studies?: LaboratoryStudy[]; // Tipos de exámenes (compat UI)
    phone?: string | null;
    google_maps_url?: string | null;
    is_published?: boolean;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    }; // Ubicación (coordenadas)
    isActive?: boolean; // Estado del servicio: Activo / Inactivo
  };
  reviewsList?: Array<{ // Lista de reseñas recientes (diferente de reviews que es un número)
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

