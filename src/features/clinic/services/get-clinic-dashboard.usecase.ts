import type { ClinicDashboard } from '../types/clinic.entity';
import { getClinicDashboardAPI } from '../api/clinic.api';

export const getClinicDashboardUseCase = async (): Promise<ClinicDashboard> => {
  return await getClinicDashboardAPI();
};
