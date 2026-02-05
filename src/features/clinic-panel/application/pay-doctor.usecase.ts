import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
// import { payDoctorAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Pagar a un médico
 */
export const payDoctorUseCase = async (
  doctorId: string,
  paymentId: string
): Promise<ClinicToDoctorPayment> => {
  // TODO: Cambiar a API real cuando esté disponible
  // return await payDoctorAPI(doctorId, paymentId);
  
  // Mock temporal
  return {
    id: `cdp-${Date.now()}`,
    clinicId: 'clinic-001',
    clinicName: 'Clínica San Francisco',
    doctorId,
    doctorName: 'Doctor',
    amount: 0,
    status: 'paid',
    paymentDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    clinicPaymentId: paymentId,
  };
};
