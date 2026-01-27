export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';
export type PaymentMethodType = 'CASH' | 'CARD';

export interface AppointmentHistory {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  reason: string;
  status: AppointmentStatus; 
  paymentMethod: PaymentMethodType;
  amount?: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  appointments: AppointmentHistory[];
  profilePicture?: string; // Agregado porque el backend lo devuelve
}