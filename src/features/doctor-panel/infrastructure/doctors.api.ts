// import { httpClient } from '../../../shared/lib/http'; // TODO: Descomentar cuando se implemente la API real
import type { DoctorDashboard, WorkSchedule, PaymentMethod, ProfileStatus } from '../domain/DoctorDashboard.entity';

export interface UpdateDoctorProfileParams {
  name?: string;
  specialty?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  price?: number;
  description?: string;
  experience?: number; 
  workSchedule?: WorkSchedule[];
  profileStatus?: ProfileStatus;
  paymentMethods?: PaymentMethod;
  consultationDuration?: number;
  blockedDates?: string[];
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
  };
}

// Mock data para el dashboard del doctor
const mockDoctorDashboard: DoctorDashboard = {
  visits: 245,
  contacts: 89,
  reviews: 32,
  rating: 4.8,
  doctor: {
    name: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    email: 'doctor@medicones.com',
    whatsapp: '+593 99 123 4567',
    address: 'Av. Principal 123, Quito',
    price: 50,
    description: 'Especialista en cardiología con más de 10 años de experiencia.',
    experience: 10, 
    workSchedule: [
      { day: 'monday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'friday', enabled: true, startTime: '09:00', endTime: '17:00' },
    ],
    profileStatus: 'draft',
    paymentMethods: 'both',
    consultationDuration: 30,
  },
};

export const getDoctorDashboardAPI = async (_userId: string): Promise<DoctorDashboard> => {
  // TODO: Reemplazar con llamada real a la API cuando esté disponible
  
  // Por ahora retornamos datos mock o desde localStorage si existe
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem(`doctor-profile-${_userId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            resolve(parsed);
          } else {
            resolve(mockDoctorDashboard);
          }
        } catch (error) {
          console.error('Error loading doctor dashboard from localStorage:', error);
          resolve(mockDoctorDashboard);
        }
      }, 500);
    } catch (error) {
      console.error('Error in getDoctorDashboardAPI:', error);
      reject(error);
    }
  });
};

export const updateDoctorProfileAPI = async (
  userId: string,
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  // TODO: Reemplazar con llamada real a la API cuando esté disponible
  
  // Por ahora simulamos la actualización
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Obtener datos actuales o usar mock
        const saved = localStorage.getItem(`doctor-profile-${userId}`);
        const currentData = saved ? JSON.parse(saved) : mockDoctorDashboard;
        
        const updatedDashboard: DoctorDashboard = {
          ...currentData,
          doctor: {
            ...currentData.doctor,
            ...(params.name !== undefined && { name: params.name }),
            ...(params.specialty !== undefined && { specialty: params.specialty }),
            ...(params.email !== undefined && { email: params.email }),
            ...(params.whatsapp !== undefined && { whatsapp: params.whatsapp }),
            ...(params.address !== undefined && { address: params.address }),
            ...(params.price !== undefined && { price: params.price }),
            ...(params.description !== undefined && { description: params.description }),
            ...(params.experience !== undefined && { experience: params.experience }),
            ...(params.workSchedule !== undefined && { workSchedule: params.workSchedule }),
            ...(params.profileStatus !== undefined && { profileStatus: params.profileStatus }),
            ...(params.paymentMethods !== undefined && { paymentMethods: params.paymentMethods }),
            ...(params.consultationDuration !== undefined && { consultationDuration: params.consultationDuration }),
            ...(params.blockedDates !== undefined && { blockedDates: params.blockedDates }),
            ...(params.bankAccount !== undefined && { bankAccount: params.bankAccount }),
          },
        };
        // Guardar en localStorage para persistencia
        localStorage.setItem(`doctor-profile-${userId}`, JSON.stringify(updatedDashboard));
        resolve(updatedDashboard);
      } catch (error) {
        console.error('Error updating doctor profile:', error);
        // En caso de error, retornar datos actualizados con mock
        const updatedDashboard: DoctorDashboard = {
          ...mockDoctorDashboard,
          doctor: {
            ...mockDoctorDashboard.doctor,
            ...(params.name !== undefined && { name: params.name }),
            ...(params.specialty !== undefined && { specialty: params.specialty }),
            ...(params.email !== undefined && { email: params.email }),
            ...(params.whatsapp !== undefined && { whatsapp: params.whatsapp }),
            ...(params.address !== undefined && { address: params.address }),
            ...(params.price !== undefined && { price: params.price }),
            ...(params.description !== undefined && { description: params.description }),
            ...(params.experience !== undefined && { experience: params.experience }),
            ...(params.workSchedule !== undefined && { workSchedule: params.workSchedule }),
            ...(params.profileStatus !== undefined && { profileStatus: params.profileStatus }),
            ...(params.paymentMethods !== undefined && { paymentMethods: params.paymentMethods }),
            ...(params.consultationDuration !== undefined && { consultationDuration: params.consultationDuration }),
            ...(params.blockedDates !== undefined && { blockedDates: params.blockedDates }),
            ...(params.bankAccount !== undefined && { bankAccount: params.bankAccount }),
          },
        };
        resolve(updatedDashboard);
      }
    }, 500);
  });
};