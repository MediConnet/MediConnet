export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}

export interface DoctorDashboard {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
  doctor: {
    name: string;
    specialty: string;
    email: string;
    whatsapp: string;
    address: string;
    price: number;
    description: string;
    experience?: number; 
    workSchedule?: WorkSchedule[]; 
  };
}