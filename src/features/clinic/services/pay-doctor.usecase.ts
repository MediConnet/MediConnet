import type { ClinicToDoctorPayment } from '../types/clinic-to-doctor-payment.entity';
import { payDoctorAPI } from '../api/clinic-payments.api';

export const payDoctorUseCase = async (
  doctorId: string,
  paymentId: string
): Promise<ClinicToDoctorPayment> => {
  return await payDoctorAPI(doctorId, paymentId);
};
