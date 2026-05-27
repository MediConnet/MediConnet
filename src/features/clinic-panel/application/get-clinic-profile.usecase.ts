import type { ClinicProfile } from '../domain/clinic.entity';
import { getClinicProfileAPI } from '../infrastructure/clinic.api';

export const getClinicProfileUseCase = async (): Promise<ClinicProfile> => {
  return await getClinicProfileAPI();
};
