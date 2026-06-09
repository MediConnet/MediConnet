import type { AppointmentStatus, PaymentMethodType } from "./Patient.entity";

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientAvatar?: string;

  date: string;
  time: string;

  reason: string;
  notes?: string;
  locationAddress?: string;
  locationGoogleMapsUrl?: string;
  locationLatitude?: number;
  locationLongitude?: number;

  status: AppointmentStatus;

  paymentMethod: string;
  paymentMethodRaw: PaymentMethodType;

  price: number;
  isPaid: boolean;
}
