import { httpClient, extractData } from '../../../shared/lib/http';
import type { Payment } from '../domain/Payment.entity';

/**
 * API: Obtener pagos del médico (pendientes y pagados)
 * Endpoint: GET /api/doctors/payments
 * 
 * Retorna pagos de:
 * - Médicos independientes: pagos del admin
 * - Médicos de clínica: pagos de la clínica
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
