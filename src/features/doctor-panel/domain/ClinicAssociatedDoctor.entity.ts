/**
 * Entidades para médico asociado a una clínica
 */

export interface ClinicInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  logoUrl?: string;
}

export interface ClinicAssociatedDoctorProfile {
  id: string;
  clinicId: string;
  clinicInfo: ClinicInfo;
  // Información profesional del médico (editable)
  specialty: string;
  experience?: number; // Años de experiencia
  bio?: string; // Descripción breve
  education?: string[]; // Estudios
  certifications?: string[]; // Certificaciones
  profileImageUrl?: string;
  // Información de contacto (puede ser diferente a la clínica)
  phone?: string;
  whatsapp?: string;
  email: string;
}

export interface ReceptionMessage {
  id: string;
  clinicId: string;
  doctorId: string;
  from: 'doctor' | 'reception';
  message: string;
  timestamp: string;
  isRead: boolean;
  senderName?: string;
}

export interface DateBlockRequest {
  id: string;
  doctorId: string;
  clinicId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ClinicAssociatedAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  time: string;
  reason?: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  // NO incluir información financiera
}
