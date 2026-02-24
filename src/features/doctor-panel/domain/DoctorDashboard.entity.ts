export interface WorkSchedule {
  day: string; // 'monday', 'tuesday', etc.
  day_id?: number; // Añadido para coincidir con backend (0-6)
  enabled: boolean; // Mapear desde 'is_active'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  // Break time (almuerzo). Si no hay almuerzo: ambos null.
  breakStart?: string | null; // 'HH:mm' | null
  breakEnd?: string | null;   // 'HH:mm' | null
  timeSlots?: TimeSlot[]; 
  blockedHours?: string[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// Mantenemos tus tipos para que el UI (Selects/Checkboxes) siga funcionando
export type PaymentMethod = 'card' | 'cash' | 'both'; 
export type ProfileStatus = 'draft' | 'published' | 'suspended';

export interface DoctorDashboard {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
  doctor: {
    id?: string; // Útil tener el ID
    name: string;
    specialty: string | string[]; // Puede ser string o array
    specialties?: Array<{ id: string; name: string }>; // Array estructurado de especialidades
    email: string;
    whatsapp: string;
    address: string;
    price: number;
    description: string;
    experience?: number; 
    workSchedule?: WorkSchedule[];
    isActive?: boolean; 
    profileStatus?: ProfileStatus; 
    paymentMethods?: PaymentMethod; 
    consultationDuration?: number; 
    // bankAccount... (pendiente en backend)
  };
  // Información de clínica si el médico está asociado
  clinic?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    logoUrl?: string;
  } | null;
}