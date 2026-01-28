export type AppointmentStatus = 'scheduled' | 'confirmed' | 'attended' | 'cancelled' | 'no_show';

export interface ClinicAppointment {
  id: string;
  clinicId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  date: string; // ISO date string
  time: string; // 'HH:mm'
  reason?: string;
  status: AppointmentStatus;
  // Control de recepción
  receptionStatus?: 'arrived' | 'not_arrived' | 'attended';
  receptionNotes?: string;
  createdAt: string;
  updatedAt?: string;
}
