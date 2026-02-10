export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}

export interface SupplyDashboard {
  visits: number;
  contacts: number;
  reviews: number; // Cantidad de reseñas
  rating: number;
  supply: {
    name: string;
    email: string;
    whatsapp: string;
    address: string;
    description: string;
    schedule: string;
    workSchedule?: WorkSchedule[]; // Horario laboral de lunes a viernes
    isActive?: boolean; // Estado del servicio: Activo / Inactivo
  };
  reviewsList?: Array<{ // Lista de reseñas (diferente de reviews que es un número)
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

