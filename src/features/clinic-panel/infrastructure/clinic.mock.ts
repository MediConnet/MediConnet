import type { ClinicProfile, ClinicDashboard, ClinicSchedule } from '../domain/clinic.entity';

const mockClinicSchedule: ClinicSchedule = {
  monday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  tuesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  wednesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  thursday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  friday: { enabled: true, startTime: '08:00', endTime: '18:00' },
  saturday: { enabled: true, startTime: '09:00', endTime: '13:00' },
  sunday: { enabled: false, startTime: '09:00', endTime: '13:00' },
};

export const MOCK_CLINIC_PROFILE: ClinicProfile = {
  id: 'clinic-1',
  name: 'Clínica San José',
  logoUrl: 'https://via.placeholder.com/150',
  specialties: ['Medicina General', 'Cardiología', 'Pediatría', 'Ginecología'],
  address: 'Av. Principal 123, Quito, Ecuador',
  latitude: -0.180653, // Coordenadas de Quito, Ecuador
  longitude: -78.467834,
  phone: '0991234567',
  whatsapp: '0991234567',
  generalSchedule: mockClinicSchedule,
  description: 'Clínica especializada en atención médica integral con más de 20 años de experiencia.',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const getClinicProfileMock = (): Promise<ClinicProfile> => {
  const saved = localStorage.getItem('clinic_profile');
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar el mock
    }
  }
  return Promise.resolve(MOCK_CLINIC_PROFILE);
};

export const saveClinicProfileMock = (profile: ClinicProfile): Promise<void> => {
  console.log('💾 Guardando perfil en localStorage:', profile);
  localStorage.setItem('clinic_profile', JSON.stringify(profile));
  console.log('✅ Perfil guardado exitosamente');
  return Promise.resolve();
};

export const getClinicDashboardMock = (): Promise<ClinicDashboard> => {
  const profile = getClinicProfileMock();
  return profile.then((p) => ({
    totalDoctors: 5,
    activeDoctors: 4,
    totalAppointments: 120,
    todayAppointments: 8,
    pendingAppointments: 3,
    completedAppointments: 5,
    clinic: p,
  }));
};
