import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import { getClinicToDoctorPaymentsMock } from '../infrastructure/clinic-payments.mock';
// import { getClinicToDoctorPaymentsAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Obtener pagos realizados a médicos
 */
export const getClinicToDoctorPaymentsUseCase = async (clinicId: string): Promise<ClinicToDoctorPayment[]> => {
  // TODO: Cambiar a API real cuando esté disponible
  // return await getClinicToDoctorPaymentsAPI();
  return getClinicToDoctorPaymentsMock(clinicId);
};
