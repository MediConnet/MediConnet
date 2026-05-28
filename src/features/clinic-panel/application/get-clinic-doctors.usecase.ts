import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicDoctor } from '../domain/doctor.entity';
import { getClinicDoctorsAPI } from '../infrastructure/clinic-doctors.api';

export const getClinicDoctorsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number; status?: 'active' | 'inactive' | 'all' }
): Promise<PaginatedResponse<ClinicDoctor>> => {
  return await getClinicDoctorsAPI(params);
};
