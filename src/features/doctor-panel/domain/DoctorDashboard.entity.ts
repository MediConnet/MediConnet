export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  timeSlots?: TimeSlot[]; // Bloques horarios predefinidos
  blockedHours?: string[]; // Horas bloqueadas específicas ['09:00', '10:00']
}

export interface TimeSlot {
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  available: boolean;
}

export type PaymentMethod = 'card' | 'cash' | 'both';
export type ProfileStatus = 'draft' | 'published' | 'suspended';

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
    isActive?: boolean; // Estado del servicio: Activo / Inactivo
    profileStatus?: ProfileStatus; // Borrador, Publicado, Suspendido
    paymentMethods?: PaymentMethod; // Formas de pago aceptadas
    consultationDuration?: number; // Duración de consulta en minutos
    blockedDates?: string[]; // Fechas bloqueadas ['2024-01-15', '2024-01-20']
    bankAccount?: {
      bankName: string;
      accountNumber: string;
      accountType: string; // 'checking' | 'savings'
      accountHolder: string;
    };
  };
}