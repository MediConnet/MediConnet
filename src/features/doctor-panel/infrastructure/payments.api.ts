import { httpClient, extractData } from '../../../shared/lib/http';
import type { Payment } from '../domain/Payment.entity';

/**
 * API: Obtener pagos del médico (pendientes y pagados)
 * Endpoint: GET /api/doctors/payments
 */
export const getDoctorPaymentsAPI = async (): Promise<Payment[]> => {
  const response = await httpClient.get<{ success: boolean; data: Payment[] }>(
    '/doctors/payments'
  );
  return extractData(response);
};

/**
 * API: Obtener detalle de un pago específico
 * Endpoint: GET /api/doctors/payments/:id
 */
export const getDoctorPaymentByIdAPI = async (paymentId: string): Promise<Payment> => {
  const response = await httpClient.get<{ success: boolean; data: Payment }>(
    `/doctors/payments/${paymentId}`
  );
  return extractData(response);
};

// ─── Bank Account ────────────────────────────────────────────────────────────

export interface BankAccountData {
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountHolder: string;
  identificationNumber?: string | null;
}

/**
 * API: Obtener datos bancarios del médico
 * Endpoint: GET /api/doctors/bank-account
 */
export const getDoctorBankAccountAPI = async (): Promise<BankAccountData | null> => {
  const response = await httpClient.get<{ success: boolean; data: BankAccountData | null }>(
    '/doctors/bank-account'
  );
  return extractData(response);
};

/**
 * API: Guardar/actualizar datos bancarios del médico
 * Endpoint: PUT /api/doctors/bank-account
 */
export const updateDoctorBankAccountAPI = async (data: {
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountHolder: string;
}): Promise<BankAccountData> => {
  const response = await httpClient.put<{ success: boolean; data: BankAccountData }>(
    '/doctors/bank-account',
    data
  );
  return extractData(response);
};
