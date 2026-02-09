import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import { getClinicToDoctorPaymentsAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Obtener pagos realizados a médicos
 */
export const getClinicToDoctorPaymentsUseCase = async (clinicId: string): Promise<ClinicToDoctorPayment[]> => {
  return await getClinicToDoctorPaymentsAPI();
};
