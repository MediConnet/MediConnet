import type { ClinicPayment } from '../domain/clinic-payment.entity';
import { getClinicPaymentsMock } from '../infrastructure/clinic-payments.mock';
// import { getClinicPaymentsAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Obtener pagos recibidos del administrador
 */
export const getClinicPaymentsUseCase = async (clinicId: string): Promise<ClinicPayment[]> => {
  // TODO: Cambiar a API real cuando esté disponible
  // return await getClinicPaymentsAPI();
  return getClinicPaymentsMock(clinicId);
};
