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

/** Normaliza accountType del backend (puede venir en español o inglés) */
const normalizeAccountType = (type: string): string => {
  if (!type) return 'checking';
  const lower = type.toLowerCase();
  if (lower === 'corriente' || lower === 'checking') return 'checking';
  if (lower === 'ahorros' || lower === 'savings') return 'savings';
  return type;
};

/** Extrae y normaliza datos bancarios de la respuesta del backend */
const extractBankAccount = (raw: any): BankAccountData | null => {
  if (!raw) return null;
  // Manejar doble anidamiento: { data: { bankName: ... } }
  const data = raw?.data ?? raw;
  if (!data || !data.bankName) return null;
  return {
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountType: normalizeAccountType(data.accountType),
    accountHolder: data.accountHolder,
    identificationNumber: data.identificationNumber ?? null,
  };
};

/**
 * API: Obtener datos bancarios del médico
 * Endpoint: GET /api/doctors/bank-account
 */
export const getDoctorBankAccountAPI = async (): Promise<BankAccountData | null> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/doctors/bank-account'
  );
  const extracted = extractData(response);
  return extractBankAccount(extracted);
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
  const response = await httpClient.put<{ success: boolean; data: any }>(
    '/doctors/bank-account',
    data
  );
  const extracted = extractData(response);
  // Si el backend devuelve null o sin datos tras el update, retornar los datos enviados
  return extractBankAccount(extracted) ?? {
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountType: normalizeAccountType(data.accountType),
    accountHolder: data.accountHolder,
  };
};
