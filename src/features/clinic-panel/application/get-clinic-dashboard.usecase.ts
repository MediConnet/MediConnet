import type { ClinicDashboard } from '../domain/clinic.entity';
import { getClinicDashboardAPI } from '../infrastructure/clinic.api';

export const getClinicDashboardUseCase = async (): Promise<ClinicDashboard> => {
  return await getClinicDashboardAPI();
};
