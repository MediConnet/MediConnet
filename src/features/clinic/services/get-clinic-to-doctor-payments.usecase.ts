import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicToDoctorPayment } from '../types/clinic-to-doctor-payment.entity';
import { getClinicToDoctorPaymentsAPI } from '../api/clinic-payments.api';

export const getClinicToDoctorPaymentsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ClinicToDoctorPayment>> => {
  return await getClinicToDoctorPaymentsAPI(params);
};
