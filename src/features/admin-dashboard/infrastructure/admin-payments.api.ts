import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';

/**
 * Pago pendiente a clínica
 */
export interface AdminClinicPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  totalAmount: number;
  appCommission: number;
  gatewayFee: number;
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
    gatewayFee: number;
    date: string;
  }[];
  isDistributed: boolean;
  distributedAmount: number;
  remainingAmount: number;
  clinicBankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
    identificationNumber?: string;
    email?: string;
  } | null;
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
  gatewayFee: number;
  netAmount: number;
  status: 'pending' | 'paid';
  paymentMethod: string;
  createdAt: string;
  source: 'admin' | 'clinic';
  providerId: string;
  providerName: string;
  doctorBankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
    identificationNumber?: string;
    email?: string;
  };
}

/**
 * API: Obtener pagos pendientes a clínicas
 * Endpoint: GET /api/admin/payments/clinics
 */
export const getAdminClinicPaymentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<AdminClinicPayment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<AdminClinicPayment> }>(
    '/clinics/admin/payments',
    { params }
  );
  return extractData(response);
};

/**
 * API: Obtener pagos pendientes a médicos
 * Endpoint: GET /api/admin/payments/doctors
 */
export const getAdminDoctorPaymentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<AdminDoctorPayment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<AdminDoctorPayment> }>(
    '/admin/payments/doctors',
    { params }
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
    `/clinics/admin/payments/${clinicPaymentId}/mark-paid`
  );
};

/**
 * API: Obtener historial de pagos
 * Endpoint: GET /api/admin/payments/history
 */
export const getPaymentHistoryAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<any>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<any> }>(
    '/admin/payments/history',
    { params }
  );
  return extractData(response);
};

export interface AdminTransaction {
  id: string;
  externalTransactionId: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  amount: number;
  paymentMethod: string;
  paymentSource: string;
  patient: {
    name: string;
    identification: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
  appointment: {
    date: string | null;
    reason: string;
  };
}

/**
 * API: Obtener auditoría de transacciones Nuvei
 * Endpoint: GET /api/admin/payments/transactions
 */
export const getAdminTransactionsAPI = async (
  params?: { page?: number; limit?: number; search?: string }
): Promise<PaginatedResponse<AdminTransaction>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<AdminTransaction> }>(
    '/admin/payments/transactions',
    { params }
  );
  return extractData(response);
};
