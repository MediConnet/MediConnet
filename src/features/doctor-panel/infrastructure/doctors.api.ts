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
 */
export const getDoctorDashboardAPI = async (userId: string): Promise<DoctorDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: DoctorDashboard }>(
    `/doctors/dashboard?userId=${userId}`
  );
  return extractData(response);
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
