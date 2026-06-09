import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { Payment } from '../types/Payment.entity';

export const getDoctorPaymentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Payment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<Payment> }>(
    '/doctors/payments',
    { params }
  );
  return extractData(response);
};

export const getDoctorPaymentByIdAPI = async (paymentId: string): Promise<Payment> => {
  const response = await httpClient.get<{ success: boolean; data: Payment }>(
    `/doctors/payments/${paymentId}`
  );
  return extractData(response);
};

export interface BankAccountData {
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountHolder: string;
  identificationNumber?: string | null;
}

const normalizeAccountType = (type: string): string => {
  if (!type) return 'checking';
  const lower = type.toLowerCase();
  if (lower === 'corriente' || lower === 'checking') return 'checking';
  if (lower === 'ahorros' || lower === 'savings') return 'savings';
  return type;
};

const extractBankAccount = (raw: any): BankAccountData | null => {
  if (!raw) return null;
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

export const getDoctorBankAccountAPI = async (): Promise<BankAccountData | null> => {
  const response = await httpClient.get<{ success: boolean; data: any }>(
    '/doctors/bank-account'
  );
  const extracted = extractData(response);
  return extractBankAccount(extracted);
};

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
  return extractBankAccount(extracted) ?? {
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountType: normalizeAccountType(data.accountType),
    accountHolder: data.accountHolder,
  };
};
