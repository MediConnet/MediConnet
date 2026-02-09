import type { ClinicPayment } from '../domain/clinic-payment.entity';
import { getClinicPaymentsAPI } from '../infrastructure/clinic-payments.api';

/**
 * Caso de uso: Obtener pagos recibidos del administrador
 */
export const getClinicPaymentsUseCase = async (clinicId: string): Promise<ClinicPayment[]> => {
  return await getClinicPaymentsAPI();
};
