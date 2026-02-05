import type { PaymentDistribution } from '../domain/payment-distribution.entity';
// import { distributePaymentAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Distribuir pago entre médicos
 */
export const distributePaymentUseCase = async (
  paymentId: string,
  distribution: { doctorId: string; amount: number }[]
): Promise<PaymentDistribution> => {
  // TODO: Cambiar a API real cuando esté disponible
  // return await distributePaymentAPI(paymentId, distribution);
  
  // Mock temporal
  const totalDistributed = distribution.reduce((sum, d) => sum + d.amount, 0);
  return {
    clinicPaymentId: paymentId,
    totalReceived: totalDistributed,
    distributions: distribution.map(d => ({
      doctorId: d.doctorId,
      doctorName: 'Doctor',
      amount: d.amount,
      percentage: (d.amount / totalDistributed) * 100,
      status: 'pending',
    })),
    totalDistributed,
    remaining: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
