import { httpClient, extractData } from '../../../shared/lib/http';
import type { ClinicPayment } from '../domain/clinic-payment.entity';
import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import type { PaymentDistribution } from '../domain/payment-distribution.entity';

/**
 * API: Obtener pagos recibidos del administrador
 * Endpoint: GET /api/clinics/payments
 */
export const getClinicPaymentsAPI = async (): Promise<ClinicPayment[]> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicPayment[] }>(
    '/clinics/payments'
  );
  return extractData(response);
};

/**
 * API: Obtener detalle de un pago
 * Endpoint: GET /api/clinics/payments/:id
 */
export const getClinicPaymentByIdAPI = async (paymentId: string): Promise<ClinicPayment> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicPayment }>(
    `/clinics/payments/${paymentId}`
  );
  return extractData(response);
};

/**
 * API: Distribuir pago entre médicos
 * Endpoint: POST /api/clinics/payments/:id/distribute
 */
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

/**
 * API: Obtener pagos realizados a médicos
 * Endpoint: GET /api/clinics/doctors/payments
 */
export const getClinicToDoctorPaymentsAPI = async (): Promise<ClinicToDoctorPayment[]> => {
  const response = await httpClient.get<{ success: boolean; data: ClinicToDoctorPayment[] }>(
    '/clinics/doctors/payments'
  );
  return extractData(response);
};

/**
 * API: Pagar a un médico específico
 * Endpoint: POST /api/clinics/doctors/:doctorId/pay
 */
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

/**
 * API: Obtener distribución de un pago
 * Endpoint: GET /api/clinics/payments/:id/distribution
 */
export const getPaymentDistributionAPI = async (paymentId: string): Promise<PaymentDistribution> => {
  const response = await httpClient.get<{ success: boolean; data: PaymentDistribution }>(
    `/clinics/payments/${paymentId}/distribution`
  );
  return extractData(response);
};
