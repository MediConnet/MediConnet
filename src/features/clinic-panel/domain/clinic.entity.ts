export interface ClinicProfile {
  id: string;
  name: string;
  logoUrl?: string;
  specialties: string[]; // Especialidades que ofrece la clínica
  address: string;
  phone: string;
  whatsapp: string;
  generalSchedule: ClinicSchedule; // Horarios generales de la clínica
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
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
