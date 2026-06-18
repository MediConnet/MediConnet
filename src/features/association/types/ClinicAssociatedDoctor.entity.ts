import type { ClinicSchedule, BankAccount } from '../../clinic-panel/domain/clinic.entity';

export interface ClinicInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  logoUrl?: string;
  generalSchedule?: ClinicSchedule;
  bankAccount?: BankAccount;
}

export interface ClinicAssociatedDoctorProfile {
  id: string;
  clinicId: string | null;
  clinicInfo: ClinicInfo | null;
  specialty: string;
  experience?: number;
  bio?: string;
  education?: string[];
  certifications?: string[];
  profileImageUrl?: string;
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
  startDate: string;
  endDate: string;
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
  status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' | 'PENDING' | 'PENDING_CONFIRMATION';
}
