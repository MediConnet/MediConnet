import { httpClient, extractData } from '../../../shared/lib/http';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicPayment } from '../types/clinic-payment.entity';
import type { ClinicToDoctorPayment } from '../types/clinic-to-doctor-payment.entity';
import type { PaymentDistribution } from '../types/payment-distribution.entity';

export const getClinicPaymentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicPayment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicPayment> }>(
    '/clinics/payments',
    { params }
  );
  return extractData(response);
};

export const getClinicPaymentByIdAPI = async (paymentId: string): Promise<ClinicPayment> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicPayment }>(
    `/clinics/payments/${paymentId}`
  );
  return extractData(response);
};

export const distributePaymentAPI = async (
  paymentId: string,
  distribution: {
    doctorId: string;
    amount: number;
  }[]
): Promise<PaymentDistribution> => {
  const response = await httpClient.post<{ success: boolean; data: PaymentDistribution }>(
    `/clinics/payments/${paymentId}/distribute`,
    { distribution }
  );
  return extractData(response);
};

export const getClinicToDoctorPaymentsAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicToDoctorPayment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ClinicToDoctorPayment> }>(
    '/clinics/doctors/payments',
    { params }
  );
  return extractData(response);
};

export const payDoctorAPI = async (
  doctorId: string,
  paymentId: string
): Promise<ClinicToDoctorPayment> => {
  const response = await httpClient.post<{ success: boolean; data: ClinicToDoctorPayment }>(
    `/clinics/doctors/${doctorId}/pay`,
    { paymentId }
  );
  return extractData(response);
};

export const getPaymentDistributionAPI = async (paymentId: string): Promise<PaymentDistribution> => {
  const response = await httpClient.get<{ success: boolean; data: PaymentDistribution }>(
    `/clinics/payments/${paymentId}/distribution`
  );
  return extractData(response);
};
