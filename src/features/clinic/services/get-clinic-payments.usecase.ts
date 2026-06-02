import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicPayment } from '../types/clinic-payment.entity';
import { getClinicPaymentsAPI } from '../api/clinic-payments.api';

export const getClinicPaymentsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicPayment>> => {
  return await getClinicPaymentsAPI(params);
};
