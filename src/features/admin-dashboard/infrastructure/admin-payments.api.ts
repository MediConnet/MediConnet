import { httpClient, extractData } from '../../../shared/lib/http';

/**
 * Pago pendiente a clínica
 */
export interface AdminClinicPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  totalAmount: number;
  appCommission: number;
  netAmount: number;
  status: 'pending' | 'paid';
  paymentDate: string | null;
  createdAt: string;
  appointments: {
    id: string;
    doctorId: string;
    doctorName: string;
    patientName: string;
    amount: number;
    date: string;
  }[];
  isDistributed: boolean;
  distributedAmount: number;
  remainingAmount: number;
}

/**
 * Pago pendiente a médico
 */
export interface AdminDoctorPayment {
  id: string;
  appointmentId: string;
  patientName: string;
  date: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'paid';
  paymentMethod: string;
  createdAt: string;
  source: 'admin' | 'clinic';
  providerId: string;
  providerName: string;
}

/**
 * API: Obtener pagos pendientes a clínicas
 * Endpoint: GET /api/admin/payments/clinics
 */
export const getAdminClinicPaymentsAPI = async (): Promise<AdminClinicPayment[]> => {
  const response = await httpClient.get<{ success: boolean; data: AdminClinicPayment[] }>(
    '/admin/payments/clinics'
  );
  return extractData(response);
};

/**
 * API: Obtener pagos pendientes a médicos
 * Endpoint: GET /api/admin/payments/doctors
 */
export const getAdminDoctorPaymentsAPI = async (): Promise<AdminDoctorPayment[]> => {
  const response = await httpClient.get<{ success: boolean; data: AdminDoctorPayment[] }>(
    '/admin/payments/doctors'
  );
  return extractData(response);
};

/**
 * API: Marcar pagos a médico como pagados
 * Endpoint: POST /api/admin/payments/doctors/:doctorId/mark-paid
 */
export const markDoctorPaymentsAsPaidAPI = async (
  doctorId: string,
  paymentIds: string[]
): Promise<void> => {
  await httpClient.post<{ success: boolean }>(
    `/admin/payments/doctors/${doctorId}/mark-paid`,
    { paymentIds }
  );
};

/**
 * API: Marcar pago a clínica como pagado
 * Endpoint: POST /api/admin/payments/clinics/:clinicPaymentId/mark-paid
 */
export const markClinicPaymentAsPaidAPI = async (clinicPaymentId: string): Promise<void> => {
  await httpClient.post<{ success: boolean }>(
    `/admin/payments/clinics/${clinicPaymentId}/mark-paid`
  );
};

/**
 * API: Obtener historial de pagos
 * Endpoint: GET /api/admin/payments/history
 */
export const getPaymentHistoryAPI = async (): Promise<any[]> => {
  const response = await httpClient.get<{ success: boolean; data: any[] }>(
    '/admin/payments/history'
  );
  return extractData(response);
};
