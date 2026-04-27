import type { AppointmentStatus, PaymentMethodType } from "./Patient.entity";

// Esta es la interfaz que tu UI (Tablas, Cards) va a consumir
export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string; // Opcional porque tu backend actual devuelve nombre y teléfono
  patientPhone: string;
  patientAvatar?: string;
  
  date: string; // YYYY-MM-DD (Extraído de scheduled_for)
  time: string; // HH:mm (Extraído de scheduled_for)
  
  reason: string;
  notes?: string; // Si añades notas en el futuro
  locationAddress?: string;
  locationGoogleMapsUrl?: string;
  locationLatitude?: number;
  locationLongitude?: number;
  
  status: AppointmentStatus;
  
  paymentMethod: string; // "Tarjeta" o "Efectivo" (Label formateado)
  paymentMethodRaw: PaymentMethodType; // "CARD" o "CASH" (Para lógica)
  
  price: number;
  isPaid: boolean;
}