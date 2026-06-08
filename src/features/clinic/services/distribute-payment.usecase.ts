import type { PaymentDistribution } from '../types/payment-distribution.entity';
import { distributePaymentAPI } from '../api/clinic-payments.api';

export const distributePaymentUseCase = async (
  paymentId: string,
  distribution: { doctorId: string; amount: number }[]
): Promise<PaymentDistribution> => {
  return await distributePaymentAPI(paymentId, distribution);
};
