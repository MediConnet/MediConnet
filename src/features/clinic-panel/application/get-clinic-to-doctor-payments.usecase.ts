import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicToDoctorPayment } from '../domain/clinic-to-doctor-payment.entity';
import { getClinicToDoctorPaymentsAPI } from '../infrastructure/clinic-payments.api';

export const getClinicToDoctorPaymentsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicToDoctorPayment>> => {
  return await getClinicToDoctorPaymentsAPI(params);
};
