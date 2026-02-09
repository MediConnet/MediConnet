import type { PaymentDistribution } from '../domain/payment-distribution.entity';
import { distributePaymentAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Distribuir pago entre médicos
 */
export const distributePaymentUseCase = async (
  paymentId: string,
  distribution: { doctorId: string; amount: number }[]
): Promise<PaymentDistribution> => {
  return await distributePaymentAPI(paymentId, distribution);
};
