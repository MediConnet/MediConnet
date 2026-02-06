import type { 
  ClinicInfo,
  ClinicAssociatedDoctorProfile,
  ReceptionMessage,
  DateBlockRequest,
  ClinicAssociatedAppointment
} from '../domain/ClinicAssociatedDoctor.entity';
import type { ClinicSchedule, BankAccount } from '../../clinic-panel/domain/clinic.entity';

// Mock data para desarrollo
const MOCK_CLINIC_SCHEDULE: ClinicSchedule = {
  monday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  tuesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  wednesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  thursday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  friday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  saturday: { enabled: true, startTime: '09:00', endTime: '13:00' },
  sunday: { enabled: false, startTime: '09:00', endTime: '13:00' },
};

const MOCK_BANK_ACCOUNT: BankAccount = {
  bankName: 'Banco Pichincha',
  accountNumber: '2100123456',
  accountType: 'checking',
  accountHolder: 'Clínica San José S.A.',
  identificationNumber: '1792345678001',
};

const MOCK_CLINIC_INFO: ClinicInfo = {
  id: 'clinic-1',
  name: 'Clínica San José',
  address: 'Av. Principal 123, Quito, Ecuador',
  phone: '0991234567',
  whatsapp: '0991234567',
  logoUrl: 'https://via.placeholder.com/150',
  generalSchedule: MOCK_CLINIC_SCHEDULE,
  bankAccount: MOCK_BANK_ACCOUNT,
};

const MOCK_CLINIC_ASSOCIATED_PROFILE: ClinicAssociatedDoctorProfile = {
  id: 'doctor-1',
  clinicId: 'clinic-1',
  clinicInfo: MOCK_CLINIC_INFO,
  specialty: 'Cardiología',
  experience: 10,
  bio: 'Médico cardiólogo con más de 10 años de experiencia en el tratamiento de enfermedades cardiovasculares.',
  education: [
    'Universidad Central del Ecuador - Medicina',
    'Especialización en Cardiología - Universidad de Quito',
  ],
  certifications: [
    'Certificación en Ecocardiografía',
    'Certificación en Electrocardiografía',
  ],
  profileImageUrl: 'https://via.placeholder.com/200',
  phone: '0998765432',
  whatsapp: '0998765432',
  email: 'doctor@example.com',
};

const MOCK_RECEPTION_MESSAGES: ReceptionMessage[] = [
  {
    id: 'msg-1',
    clinicId: 'clinic-1',
    doctorId: 'doctor-1',
    from: 'reception',
    message: 'Buenos días, tenemos una cita urgente para las 2:00 PM. ¿Puede atenderla?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    senderName: 'Recepción',
  },
  {
    id: 'msg-2',
    clinicId: 'clinic-1',
    doctorId: 'doctor-1',
    from: 'doctor',
    message: 'Sí, puedo atenderla. Gracias por avisar.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    senderName: 'Dr. Juan Pérez',
  },
];

const MOCK_DATE_BLOCK_REQUESTS: DateBlockRequest[] = [
  {
    id: 'block-1',
    doctorId: 'doctor-1',
    clinicId: 'clinic-1',
    startDate: '2025-02-15',
    endDate: '2025-02-20',
    reason: 'Vacaciones',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'block-2',
    doctorId: 'doctor-1',
    clinicId: 'clinic-1',
    startDate: '2025-01-10',
    endDate: '2025-01-12',
    reason: 'Congreso médico',
    status: 'approved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'admin-clinic-1',
  },
];

const MOCK_APPOINTMENTS: ClinicAssociatedAppointment[] = [
  {
    id: 'apt-1',
    patientId: 'patient-1',
    patientName: 'María González',
    patientPhone: '0991111111',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    reason: 'Consulta general',
    status: 'CONFIRMED',
  },
  {
    id: 'apt-2',
    patientId: 'patient-2',
    patientName: 'Carlos Rodríguez',
    patientPhone: '0992222222',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    reason: 'Control de presión',
    status: 'CONFIRMED',
  },
];

// Funciones para localStorage (mocks)
export const getClinicInfoMock = (): Promise<ClinicInfo> => {
  const saved = localStorage.getItem('clinic_info_mock');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar mock
    }
  }
  return Promise.resolve(MOCK_CLINIC_INFO);
};

export const getClinicAssociatedProfileMock = (): Promise<ClinicAssociatedDoctorProfile> => {
  const saved = localStorage.getItem('clinic_associated_profile_mock');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar mock
    }
  }
  return Promise.resolve(MOCK_CLINIC_ASSOCIATED_PROFILE);
};

export const saveClinicAssociatedProfileMock = (profile: ClinicAssociatedDoctorProfile): Promise<void> => {
  localStorage.setItem('clinic_associated_profile_mock', JSON.stringify(profile));
  return Promise.resolve();
};

export const getReceptionMessagesMock = (): Promise<ReceptionMessage[]> => {
  const saved = localStorage.getItem('reception_messages_mock');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar mock
    }
  }
  return Promise.resolve(MOCK_RECEPTION_MESSAGES);
};

export const saveReceptionMessagesMock = (messages: ReceptionMessage[]): Promise<void> => {
  localStorage.setItem('reception_messages_mock', JSON.stringify(messages));
  return Promise.resolve();
};

export const getDateBlockRequestsMock = (): Promise<DateBlockRequest[]> => {
  const saved = localStorage.getItem('date_block_requests_mock');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar mock
    }
  }
  return Promise.resolve(MOCK_DATE_BLOCK_REQUESTS);
};

export const saveDateBlockRequestsMock = (requests: DateBlockRequest[]): Promise<void> => {
  localStorage.setItem('date_block_requests_mock', JSON.stringify(requests));
  return Promise.resolve();
};

export const getClinicAssociatedAppointmentsMock = (): Promise<ClinicAssociatedAppointment[]> => {
  const saved = localStorage.getItem('clinic_associated_appointments_mock');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar mock
    }
  }
  return Promise.resolve(MOCK_APPOINTMENTS);
};

export const saveClinicAssociatedAppointmentsMock = (appointments: ClinicAssociatedAppointment[]): Promise<void> => {
  localStorage.setItem('clinic_associated_appointments_mock', JSON.stringify(appointments));
  return Promise.resolve();
};
