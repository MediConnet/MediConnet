import { httpClient, extractData } from '../../../shared/lib/http';
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

/**
 * API: Obtener dashboard del doctor
 * Endpoint: GET /api/doctors/dashboard
 * 
 * ⚠️ NOTA: El backend retorna `provider` pero el frontend espera `doctor`.
 * Se mapea la respuesta para convertir la estructura.
 */
export const getDoctorDashboardAPI = async (userId: string): Promise<DoctorDashboard> => {
  const response = await httpClient.get<{ 
    success: boolean; 
    data: {
      totalAppointments?: number;
      pendingAppointments?: number;
      completedAppointments?: number;
      totalRevenue?: number;
      averageRating?: number;
      totalReviews?: number;
      upcomingAppointments?: any[];
      provider: {
        id: string | null;
        commercial_name: string | null;
        description: string | null;
        specialty: string | null;
        logoUrl: string | null;
        category: string | null;
        branches?: any[];
        [key: string]: any; // Para otros campos que pueda retornar el backend
      };
    } 
  }>(
    `/doctors/dashboard?userId=${userId}`
  );
  
  const backendData = extractData(response);
  
  // ⚠️ CRÍTICO: Asegurar que provider existe, si no, crear un objeto vacío
  const provider = backendData.provider || {};
  
  // Mapear la estructura del backend (provider) a la estructura del frontend (doctor)
  // Siempre crear un objeto doctor válido, incluso si provider es null/undefined
  const mappedData: DoctorDashboard = {
    visits: backendData.totalAppointments || 0,
    contacts: 0, // El backend no retorna este campo, usar 0 por defecto
    reviews: backendData.totalReviews || 0,
    rating: backendData.averageRating || 0,
    doctor: {
      name: provider.commercial_name || "Dr. Usuario",
      specialty: provider.specialty || "Médico",
      email: "", // El backend no retorna email en provider, se obtiene del usuario
      whatsapp: "", // El backend no retorna whatsapp en provider
      address: "", // El backend no retorna address en provider
      price: 0, // El backend no retorna price en provider
      description: provider.description || "",
      // Campos opcionales
      experience: undefined,
      workSchedule: undefined,
      isActive: true,
      profileStatus: 'draft' as ProfileStatus,
      paymentMethods: 'both' as PaymentMethod,
      consultationDuration: undefined,
      blockedDates: undefined,
      bankAccount: undefined,
    },
  };
  
  return mappedData;
};

/**
 * API: Obtener perfil del doctor
 * Endpoint: GET /api/doctors/profile
 */
export const getDoctorProfileAPI = async (): Promise<DoctorDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: DoctorDashboard }>(
    '/doctors/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil del doctor
 * Endpoint: PUT /api/doctors/profile
 */
export const updateDoctorProfileAPI = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  const response = await httpClient.put<{ success: boolean; data: DoctorDashboard }>(
    '/doctors/profile',
    params
  );
  return extractData(response);
};

/**
 * API: Obtener citas del doctor
 * Endpoint: GET /api/doctors/appointments
 */
export const getDoctorAppointmentsAPI = async (): Promise<any[]> => {
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/appointments'
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de cita
 * Endpoint: PUT /api/doctors/appointments/:id/status
 */
export const updateAppointmentStatusAPI = async (
  appointmentId: string,
  status: string
): Promise<any> => {
  const response = await httpClient.put<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};

/**
 * API: Crear diagnóstico
 * Endpoint: POST /api/doctors/appointments/:id/diagnosis
 */
export const createDiagnosisAPI = async (
  appointmentId: string,
  diagnosisData: any
): Promise<any> => {
  const response = await httpClient.post<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/diagnosis`,
    diagnosisData
  );
  return extractData(response);
};

/**
 * API: Obtener pagos del doctor
 * Endpoint: GET /api/doctors/payments
 */
export const getDoctorPaymentsAPI = async (): Promise<any[]> => {
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/doctors/payments'
  );
  return extractData(response);
};

/**
 * API: Obtener horario del doctor
 * Endpoint: GET /api/doctors/schedule
 */
export const getDoctorScheduleAPI = async (): Promise<WorkSchedule[]> => {
  const response = await httpClient.get<{ success: boolean; data: WorkSchedule[] }>(
    '/doctors/schedule'
  );
  return extractData(response);
};

/**
 * API: Actualizar horario del doctor
 * Endpoint: PUT /api/doctors/schedule
 */
export const updateDoctorScheduleAPI = async (
  schedule: WorkSchedule[]
): Promise<WorkSchedule[]> => {
  const response = await httpClient.put<{ success: boolean; data: WorkSchedule[] }>(
    '/doctors/schedule',
    { schedule }
  );
  return extractData(response);
};
