import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import { payDoctorAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Pagar a un médico
 */
export const payDoctorUseCase = async (
  doctorId: string,
  paymentId: string
): Promise<ClinicToDoctorPayment> => {
  return await payDoctorAPI(doctorId, paymentId);
};
