import type { ClinicDoctor } from '../domain/doctor.entity';
import { getClinicDoctorsAPI } from '../infrastructure/clinic-doctors.api';

export const getClinicDoctorsUseCase = async (_clinicId: string, status?: 'active' | 'inactive' | 'all'): Promise<ClinicDoctor[]> => {
  return await getClinicDoctorsAPI(status);
};
