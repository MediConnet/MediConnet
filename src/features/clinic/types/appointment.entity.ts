export type AppointmentStatus = 'scheduled' | 'confirmed' | 'attended' | 'cancelled' | 'no_show' | 'pending_confirmation';

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
  date: string;
  time: string;
  reason?: string;
  status: AppointmentStatus;
  receptionStatus?: 'arrived' | 'not_arrived' | 'attended';
  receptionNotes?: string;
  createdAt: string;
  updatedAt?: string;
}
