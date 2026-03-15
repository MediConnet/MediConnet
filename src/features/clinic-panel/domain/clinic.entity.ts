export interface ClinicProfile {
  id: string;
  name: string;
  logoUrl?: string;
  specialties: string[]; // Especialidades que ofrece la clínica
  consultationPrices?: ConsultationPrice[]; // Precios por especialidad
  address: string;
  latitude?: number | null; // Coordenada de latitud para el mapa
  longitude?: number | null; // Coordenada de longitud para el mapa
  google_maps_url?: string | null;
  phone: string;
  whatsapp: string;
  generalSchedule: ClinicSchedule; // Horarios generales de la clínica
  description: string;
  isActive: boolean;
  bankAccount?: BankAccount; // Cuenta bancaria para recibir pagos del admin
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultationPrice {
  specialty: string; // Nombre de la especialidad
  price: number; // Precio de la consulta
  isActive: boolean; // Si está activa o no
}

export interface BankAccount {
  bankName: string; // Nombre del banco
  accountNumber: string; // Número de cuenta
  accountType: 'checking' | 'savings'; // Tipo de cuenta: corriente o ahorros
  accountHolder: string; // Titular de la cuenta
  identificationNumber?: string; // RUC o cédula del titular
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
