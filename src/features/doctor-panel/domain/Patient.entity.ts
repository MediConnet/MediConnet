export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';
export type PaymentMethodType = 'CASH' | 'CARD' | 'UNKNOWN';

export interface AppointmentHistory {
  id: string;
  date: string;       
  time: string;       
  reason: string;
  status: AppointmentStatus; 
  paymentMethod: PaymentMethodType;
  amount?: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  birthDate?: string | null;
  
  // Totales calculados (opcional para mostrar en tabla)
  totalAppointments?: number;
  lastAppointmentDate?: string | null;

  appointments: AppointmentHistory[];
  profilePicture?: string | null;
}