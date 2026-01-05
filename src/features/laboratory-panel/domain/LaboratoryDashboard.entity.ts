export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}

export interface LaboratoryDashboard {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
  laboratory: {
    name: string;
    email: string;
    whatsapp: string;
    address: string;
    description: string;
    schedule: string;
    workSchedule?: WorkSchedule[]; // Horario laboral de lunes a viernes
  };
}

