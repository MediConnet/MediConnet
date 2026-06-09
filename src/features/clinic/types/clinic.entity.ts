export interface ClinicProfile {
  id: string;
  name: string;
  logoUrl?: string;
  specialties: string[];
  consultationPrices?: ConsultationPrice[];
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  phone: string;
  whatsapp: string;
  generalSchedule: ClinicSchedule;
  description: string;
  isActive: boolean;
  bankAccount?: BankAccount;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultationPrice {
  specialty: string;
  price: number;
  isActive: boolean;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  accountHolder: string;
  identificationNumber?: string;
}

export interface ClinicSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface ClinicDashboard {
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  clinic: ClinicProfile;
}
